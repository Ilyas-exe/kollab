// server/controllers/paymentController.js

import Stripe from 'stripe';
import Invoice from '../models/Invoice.js';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a stripe payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
    const { invoiceId } = req.body;

    try {
        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (invoice.status === 'Paid') {
            return res.status(400).json({ message: 'Invoice has already been paid' });
        }

        // Create a PaymentIntent with the order amount and currency
        // Stripe expects the amount in the smallest currency unit (e.g., cents for USD/EUR)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(invoice.totalAmount * 100), // Convert to cents and round to avoid decimals
            currency: 'usd', // IMPORTANT: Change to 'eur' or your currency
            metadata: { 
                invoiceId: invoice._id.toString(),
                projectId: invoice.projectId.toString()
            },
        });

        // Save the PaymentIntent ID to your invoice document
        invoice.stripePaymentIntentId = paymentIntent.id;
        await invoice.save();

        // Send the clientSecret back to the frontend
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ message: 'Failed to create payment intent' });
    }
};