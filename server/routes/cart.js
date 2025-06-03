const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Cart = require('../models/cart');
const Product = require('../models/product');

// Get cart for a user
router.get('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add product to cart
router.post('/add', protect, async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ message: 'Please provide valid product ID and quantity' });
    }

    try {
        let cart = await Cart.findOne({ user: req.user._id });
        console.log(`User ID: ${req.user._id}, Product ID: ${productId}, Quantity: ${quantity}, Cart: ${cart ? 'exists' : 'does not exist'}`);
        
        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                products: [],
                totalPrice: 0
            });
        }
        // Check if product already exists in cart
        console.log(`Cart before adding product: ${JSON.stringify(cart)}`);

        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
        console.log(`Existing product index: ${existingProductIndex}`);
        
        if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        // Update total price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        cart.totalPrice += product.price * quantity;

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding to cart' });
    }
});

// Remove product from cart
router.delete('/remove/:productId', protect, async (req, res) => {
    const { productId } = req.params;

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
        
        if (existingProductIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update total price
        cart.totalPrice -= product.price * cart.products[existingProductIndex].quantity;
        
        // Remove product from cart
        cart.products.splice(existingProductIndex, 1);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error while removing from cart' });
    }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while clearing cart' });
    }
});

// Update product quantity in cart
router.put('/update/:productId', protect, async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Please provide a valid quantity' });
    }

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
        
        if (existingProductIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update total price
        cart.totalPrice += (quantity - cart.products[existingProductIndex].quantity) * product.price;
        
        // Update quantity
        cart.products[existingProductIndex].quantity = quantity;

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating cart' });
    }
});

module.exports = router;