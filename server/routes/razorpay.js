const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Razorpay = require('razorpay');
const Order = require('../models/order');
const crypto = require('crypto');
const { RAZORPAY_KEY_ID, RAZORPAY_SECRET } = process.env;
const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET
});

// Create an order
router.post('/create-order', protect, async (req, res) => {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
        return res.status(400).json({ message: 'Amount and currency are required' });
    }

    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1 // Auto capture
        };

        const order = await razorpay.orders.create(options);
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Server error while creating order' });
    }
});

// Verify payment signature
router.post('/verify-payment', protect, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: 'All payment details are required' });
    }

    const generatedSignature = crypto.createHmac('sha256', RAZORPAY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid signature' });
    }

    try {
        const order = new Order({
            user: req.user._id,
            razorpay_order_id,
            razorpay_payment_id,
            amount: req.body.amount,
            currency: req.body.currency
        });

        await order.save();
        res.status(200).json({ message: 'Payment verified successfully', order });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Server error while verifying payment' });
    }
});

// Get all orders for a user
router.get('/orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('user', 'name email');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
});

// Get a specific order by ID
router.get('/order/:id', protect, async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error while fetching order' });
    }
});

// Cancel an order
router.delete('/cancel-order/:id', protect, async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.remove();
        res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Server error while canceling order' });
    }
});

module.exports = router;