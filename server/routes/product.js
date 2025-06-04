const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Product = require('../models/product');
const cloudinary = require('../config/cloundinary');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', protect, async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/upload', protect, admin, upload.single('image'), async (req, res) => {
    cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
            if (result) {
                res.status(200).json({ imageUrl: result.secure_url });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    ).end(req.file.buffer);
});

router.post('/', protect, admin, async (req, res) => {
    const { title, image, description, price } = req.body;

    if (!title || !image || !description || !price) {
        return res.status(400).json({ message: 'Please provide title, image, description and price' });
    }

    try {
        const product = new Product({
            title,
            user: req.user._id,
            image,
            price,
            description
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error while creating product' });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.user.toString() !== req.user._id.toString() && req.user.userRole !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.user.toString() !== req.user._id.toString() && req.user.userRole !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
