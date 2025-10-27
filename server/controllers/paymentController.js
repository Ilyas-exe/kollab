// server/controllers/paymentController.js

import Stripe from 'stripe';
import Invoice from '../models/Invoice.js';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a stripe payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
    const { invoiceId, amount } = req.body;

    try {
        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (invoice.status === 'Paid') {
            return res.status(400).json({ message: 'Invoice has already been paid' });
        }

        // Create a PaymentIntent with the order amount and currency
        // Amount should already be in cents from frontend
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Already in cents
            currency: 'usd', // Change to 'eur' or your currency if needed
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

// @desc    Stripe webhook for payment events
// @route   POST /api/payments/stripe-webhook
// @access  Public
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`❌ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('✅ PaymentIntent was successful!');

    // Find the invoice using the saved PaymentIntent ID
    const invoice = await Invoice.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (invoice) {
      // Update the invoice status to 'Paid'
      invoice.status = 'Paid';
      await invoice.save();
      console.log(`Invoice ${invoice.invoiceNumber} marked as Paid.`);
    } else {
      console.log(`Webhook received for unknown PaymentIntent: ${paymentIntent.id}`);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};