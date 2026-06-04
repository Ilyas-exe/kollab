import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Stripe card element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#0b1726',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: false,
};

// Payment form component that uses Stripe hooks
const PaymentForm = ({ invoice, onClose, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const { apiClient } = useAuth();

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await apiClient.post('/payments/create-intent', {
          invoiceId: invoice._id,
          amount: Math.round(invoice.totalAmount * 100), // Convert to cents
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
      }
    };

    createPaymentIntent();
  }, [invoice._id, invoice.totalAmount, apiClient]);

  const handlePayment = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      // Development mode: skip Stripe if key is invalid or in test mode
      const isDevMode = !stripe || !elements || !clientSecret || import.meta.env.VITE_STRIPE_PUBLIC_KEY?.includes('here');

      if (isDevMode) {
        // Mock payment - directly update invoice status without Stripe
        const response = await apiClient.put(`/invoices/${invoice._id}`, {
          status: 'Paid',
          paymentIntentId: `mock_${Date.now()}`,
        });

        if (onPaymentSuccess) {
          onPaymentSuccess(response.data);
        }
        
        onClose();
        return;
      }

      const cardElement = elements.getElement(CardElement);

      // Confirm card payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // If payment succeeded, update invoice status
      if (paymentIntent.status === 'succeeded') {
        const response = await apiClient.put(`/invoices/${invoice._id}`, {
          status: 'Paid',
          paymentIntentId: paymentIntent.id,
        });

        if (onPaymentSuccess) {
          onPaymentSuccess(response.data);
        }
        
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card-strong w-full max-w-md animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-line">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-accent text-white flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-ink">Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-muted hover:text-ink hover:bg-paper transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Invoice Details */}
        <div className="p-6 bg-paper border-b border-line">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sm text-muted">Invoice Number:</span>
              <span className="font-semibold text-ink">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sm text-muted">Project:</span>
              <span className="font-semibold text-ink">{invoice.projectName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sm text-muted">Freelancer:</span>
              <span className="font-semibold text-ink">{invoice.clientName}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-300 flex justify-between">
              <span className="text-base font-semibold text-ink">Total Amount:</span>
              <span className="text-2xl font-bold text-accent">${invoice.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Payment Method Label */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Card Information
            </label>
            
            {/* Stripe Card Element */}
            <div className="border border-line rounded-lg p-4 focus-within:border-accent transition-colors bg-surface">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            
            {/* Test Card Info */}
            <div className="mt-2 bg-paper border border-line rounded-lg p-3">
              <p className="text-xs font-semibold text-muted mb-1">Test Mode - Use Test Card:</p>
              <code className="text-xs text-muted">4242 4242 4242 4242</code>
              <p className="text-xs text-muted mt-1">Any future expiry date and any 3-digit CVC</p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-sm text-muted">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure payment powered by Stripe</span>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !stripe || !clientSecret}
              className="btn btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pay ${invoice.totalAmount.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Wrapper component that provides Stripe context
const PaymentModal = ({ invoice, onClose, onPaymentSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        invoice={invoice} 
        onClose={onClose} 
        onPaymentSuccess={onPaymentSuccess} 
      />
    </Elements>
  );
};

export default PaymentModal;
