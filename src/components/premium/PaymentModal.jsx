import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { paymentService } from '../../services/paymentService';
import { toast } from 'react-hot-toast';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onSuccess, user, plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  
  const [cardholderName, setCardholderName] = useState('');
  const [vpnChecked, setVpnChecked] = useState(false);
  const [vpnAllowed, setVpnAllowed] = useState(true);

  useEffect(() => {
    if (isOpen && plan) {
      checkVPN();
      createPaymentIntent();
    }
  }, [isOpen, plan]);

  const checkVPN = async () => {
    try {
      const result = await paymentService.checkVPN();
      setVpnChecked(true);
      setVpnAllowed(!result.isVPN);
      
      if (result.isVPN) {
        setError('VPN detected. Please disable VPN to proceed with payment.');
      }
    } catch (err) {
      console.error('VPN check failed:', err);
      setVpnChecked(true);
    }
  };

  const createPaymentIntent = async () => {
    try {
      const intent = await paymentService.createPaymentIntent(plan, user);
      setClientSecret(intent.clientSecret);
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!vpnChecked) {
      setError('Checking VPN... Please wait.');
      return;
    }

    if (!vpnAllowed) {
      setError('Please disable VPN to proceed with payment.');
      return;
    }

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName || user.username,
              email: user.email,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        const result = await paymentService.processPayment(
          paymentIntent.payment_method,
          plan,
          user
        );

        if (result.success) {
          setSuccess(true);
          onSuccess({
            paymentId: result.paymentId,
            amount: result.amount,
            plan: result.plan,
            subscriptionEnd: result.subscriptionEnd,
          });

          toast.success('Payment successful! Premium features activated.');
          
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanPrice = () => {
    const prices = {
      monthly: 9.99,
      yearly: 99.99,
      lifetime: 299.99,
    };
    return prices[plan] || 9.99;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
      className="payment-modal"
      overlayClassName="payment-modal-overlay"
    >
      <div className="payment-modal-content">
        {success ? (
          <div className="payment-success">
            <div className="success-icon">🎉</div>
            <h3>Payment Successful!</h3>
            <p>Your Minigram Premium subscription has been activated.</p>
            <p className="success-details">
              You now have access to all premium features including the verified badge!
            </p>
            <Button 
              variant="premium" 
              onClick={onClose}
              className="mt-4"
            >
              Continue to Minigram
            </Button>
          </div>
        ) : (
          <>
            <div className="payment-modal-header">
              <h2 className="payment-modal-title">
                Complete Your Payment
              </h2>
              <p className="payment-modal-subtitle">
                Subscribe to Minigram Premium {plan} plan
              </p>
            </div>

            <div className="vpn-status">
              <div className={`vpn-indicator ${vpnChecked ? (vpnAllowed ? 'allowed' : 'blocked') : 'checking'}`}>
                {!vpnChecked ? '🔄 Checking VPN...' : 
                 vpnAllowed ? '✅ VPN Allowed' : '❌ VPN Detected'}
              </div>
              {vpnChecked && !vpnAllowed && (
                <p className="vpn-warning">
                  Please disable your VPN to proceed with payment.
                  This is required for security verification.
                </p>
              )}
            </div>

            <div className="selected-plan">
              <div className="plan-badge">{plan?.toUpperCase()}</div>
              <div className="plan-price">${getPlanPrice()}</div>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">
              <Input
                label="Cardholder Name"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={loading || !vpnAllowed}
                className="mb-4"
              />

              <div className="card-element-container mb-4">
                <label className="input-label">Card Details</label>
                <div className="stripe-card-element">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#32325d',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#fa755a',
                        },
                      },
                    }}
                  />
                </div>
                <div className="test-card-info">
                  <p><strong>💡 Test Card:</strong> 4242 4242 4242 4242</p>
                  <p>Any future expiry date, any 3-digit CVC</p>
                </div>
              </div>

              {error && (
                <div className="payment-error">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="payment-actions">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="premium"
                  loading={loading}
                  disabled={!stripe || !vpnAllowed || loading}
                >
                  {loading ? 'Processing...' : `Pay $${getPlanPrice()}`}
                </Button>
              </div>
            </form>

            <div className="payment-security">
              <div className="secure-badge">
                🔒 Powered by Stripe • SSL Encrypted • PCI Compliant
              </div>
              <p className="security-note">
                Your payment information is encrypted and secure. 
                We never store your card details.
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;