# Stripe Payment Integration Guide

## Overview
The payment modal (`PaymentModal.jsx`) is currently set up with a placeholder UI. To enable real Stripe payments, follow these steps.

## Installation

### 1. Install Stripe Packages
```bash
cd client
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Backend Setup (Already Done)
The backend payment controller should have an endpoint to create a payment intent:

```javascript
// server/controllers/paymentController.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  const { invoiceId } = req.body;
  
  try {
    const invoice = await Invoice.findById(invoiceId);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(invoice.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: { invoiceId: invoice._id.toString() }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### 3. Environment Variables

Add to `.env` files:

**Server (.env):**
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Client (.env):**
```
VITE_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
```

## Implementation Steps

### 4. Update PaymentModal Component

Replace the placeholder in `PaymentModal.jsx` with actual Stripe Elements:

```jsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ invoice, onPaymentSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { apiClient } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    
    try {
      // Get client secret from backend
      const { data } = await apiClient.post('/payments/create-intent', {
        invoiceId: invoice._id
      });
      
      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );
      
      if (error) {
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Update invoice status
        await apiClient.put(`/invoices/${invoice._id}`, {
          status: 'Paid'
        });
        onPaymentSuccess();
      }
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
        },
      }} />
      <button type="submit" disabled={!stripe || loading}>
        Pay ${invoice.totalAmount.toFixed(2)}
      </button>
    </form>
  );
};

// Wrap with Elements provider
const PaymentModal = ({ invoice, onClose, onPaymentSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        invoice={invoice} 
        onPaymentSuccess={onPaymentSuccess}
        onError={(error) => console.error(error)}
      />
    </Elements>
  );
};
```

### 5. Test Cards (Stripe Test Mode)

Use these test card numbers in development:

- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

### 6. Webhook Setup (Optional but Recommended)

Set up webhooks to handle payment events:

```javascript
// server/routes/paymentRoutes.js
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const invoiceId = paymentIntent.metadata.invoiceId;
      
      await Invoice.findByIdAndUpdate(invoiceId, { status: 'Paid' });
    }
    
    res.json({received: true});
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

## Production Checklist

- [ ] Replace test keys with live keys
- [ ] Enable webhook endpoints in Stripe Dashboard
- [ ] Set up proper error handling
- [ ] Add receipt emails
- [ ] Implement refund functionality
- [ ] Add payment history logging
- [ ] Set up Stripe Dashboard monitoring
- [ ] Configure payment method types (card, bank transfer, etc.)

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Stripe Dashboard](https://dashboard.stripe.com/)

## Current Status

✅ **Completed:**
- Invoice creation and listing
- PDF download functionality
- Payment modal UI
- Invoice status management

⏳ **Requires Stripe Setup:**
- Stripe API keys configuration
- npm package installation
- Actual payment processing
- Webhook handling

The payment modal will currently mark invoices as "Paid" without processing actual payments. Follow the steps above to enable real payment processing through Stripe.
