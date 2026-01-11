// src/components/premium/PaymentModal.jsx
import React, { useState, useEffect } from "react";
import "./PaymentModal.css";

// Mock payment service
const paymentService = {
  processPayment: async (paymentMethodId, plan, user) => {
    console.log('💰 Processing payment:', { paymentMethodId, plan, user });
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isFraud = paymentMethodId.includes('test') || 
                       paymentMethodId.includes('fake') ||
                       paymentMethodId.includes('4242424242424242');
        
        if (isFraud) {
          reject(new Error('Payment declined: Fraud detected'));
          return;
        }

        const paymentId = `pay_${Date.now()}`;
        const subscriptionEnd = new Date();
        
        if (plan === 'monthly') {
          subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
        } else if (plan === 'yearly') {
          subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
        } else {
          subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 100);
        }

        resolve({
          success: true,
          paymentId,
          amount: plan === 'monthly' ? 999 : plan === 'yearly' ? 9999 : 29999,
          plan,
          subscriptionEnd: subscriptionEnd.toISOString()
        });
      }, 2000);
    });
  },

  checkVPN: async (ip) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isVPN = ip.includes('192.168') || 
                     ip.includes('10.0') || 
                     Math.random() < 0.1;
        
        resolve({
          isVPN,
          message: isVPN ? 'VPN detected. Please disable VPN to proceed.' : 'No VPN detected'
        });
      }, 500);
    });
  },

  validateCard: (cardNumber, expiry, cvc) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanNumber.length !== 16 || !/^\d+$/.test(cleanNumber)) {
      return { valid: false, error: 'Invalid card number' };
    }

    const [month, year] = expiry.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      return { valid: false, error: 'Invalid expiry month' };
    }
    
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return { valid: false, error: 'Card expired' };
    }

    if (cvc.length < 3 || cvc.length > 4 || !/^\d+$/.test(cvc)) {
      return { valid: false, error: 'Invalid CVC' };
    }

    return { valid: true };
  },

  getUserIP: () => {
    const ips = ['123.456.789.101', '98.76.54.321', '192.168.1.1', '10.0.0.1'];
    return ips[Math.floor(Math.random() * ips.length)];
  },

  prices: {
    monthly: { amount: 999 },
    yearly: { amount: 9999 },
    lifetime: { amount: 29999 }
  }
};

const PaymentModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [vpnChecked, setVpnChecked] = useState(false);
  const [vpnAllowed, setVpnAllowed] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const ip = paymentService.getUserIP();
      setIpAddress(ip);
      checkVPN(ip);
    }
  }, [isOpen]);

  const checkVPN = async (ip) => {
    try {
      const result = await paymentService.checkVPN(ip);
      setVpnChecked(true);
      setVpnAllowed(!result.isVPN);
      
      if (result.isVPN) {
        setError(result.message);
      }
    } catch (err) {
      console.error('VPN check failed:', err);
    }
  };

  const handlePlanSelect = async () => {
    if (!vpnChecked) {
      setError('Checking VPN... Please wait');
      return;
    }
    
    if (!vpnAllowed) {
      setError('Please disable VPN to proceed with payment');
      return;
    }
    
    setStep(2);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validation = paymentService.validateCard(cardNumber, expiry, cvc);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const paymentMethodId = `pm_${Date.now()}_${cardNumber.replace(/\s/g, '').slice(-4)}`;
      const result = await paymentService.processPayment(paymentMethodId, plan, user);

      if (result.success) {
        setSuccess(true);
        onSuccess({
          paymentId: result.paymentId,
          amount: result.amount,
          plan: result.plan,
          subscriptionEnd: result.subscriptionEnd
        });

        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // YANGILANGAN: Card Number formatlash funksiyasi
  const formatCardNumber = (value) => {
    // Faqat raqamlarni olib, bo'sh joylarni olib tashlaymiz
    const v = value.replace(/\D/g, '');
    
    // 16 ta raqamdan oshib ketmasligi uchun
    const limited = v.slice(0, 16);
    
    // Har 4 ta raqamdan keyin bo'sh joy qo'yamiz
    const parts = [];
    for (let i = 0; i < limited.length; i += 4) {
      parts.push(limited.substring(i, i + 4));
    }
    
    return parts.join(' ');
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  // YANGILANGAN: Expiry date formatlash
  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  // YANGILANGAN: CVC formatlash
  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvc(value);
  };

  const getPlanPrice = (selectedPlan) => {
    return paymentService.prices[selectedPlan].amount / 100;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{step === 1 ? '✨ Choose Your Plan' : '💳 Payment Details'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
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

          {success ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Payment Successful!</h3>
              <p>Your Minigram Premium subscription has been activated.</p>
              <p className="success-details">
                You are now a verified user with a premium badge!
              </p>
            </div>
          ) : (
            <>
              {step === 1 ? (
                <div className="plan-selection">
                  <div className="plan-options">
                    {['monthly', 'yearly', 'lifetime'].map((p) => (
                      <div
                        key={p}
                        className={`plan-option ${plan === p ? 'selected' : ''}`}
                        onClick={() => setPlan(p)}
                      >
                        <div className="plan-name">{p.charAt(0).toUpperCase() + p.slice(1)}</div>
                        <div className="plan-price">
                          ${getPlanPrice(p)}
                          {p === 'monthly' && '/month'}
                          {p === 'yearly' && '/year'}
                          {p === 'lifetime' && ' (One-time)'}
                        </div>
                        <div className="plan-savings">
                          {p === 'yearly' && 'Save 20%'}
                          {p === 'lifetime' && 'Best Value'}
                        </div>
                        <ul className="plan-features">
                          <li>✅ Verified Badge</li>
                          <li>✅ Priority Support</li>
                          <li>✅ Premium Features</li>
                          {p === 'yearly' && <li>✅ 2 Months Free</li>}
                          {p === 'lifetime' && <li>✅ Lifetime Updates</li>}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="plan-summary">
                    <div className="summary-item">
                      <span>Selected Plan:</span>
                      <strong>{plan.charAt(0).toUpperCase() + plan.slice(1)}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Price:</span>
                      <strong>${getPlanPrice(plan)}</strong>
                    </div>
                    <div className="summary-item total">
                      <span>Total:</span>
                      <strong>${getPlanPrice(plan)}</strong>
                    </div>
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <button
                    className="btn btn-primary btn-large"
                    onClick={handlePlanSelect}
                    disabled={!vpnChecked || !vpnAllowed || loading}
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              ) : (
                <form className="payment-form" onSubmit={handleSubmit}>
                  <div className="selected-plan-info">
                    <div className="plan-badge">{plan.toUpperCase()}</div>
                    <div className="plan-amount">${getPlanPrice(plan)}</div>
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date (MM/YY)</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>CVC</label>
                      <input
                        type="password"
                        value={cvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>IP Address (for security)</label>
                    <input
                      type="text"
                      value={ipAddress}
                      readOnly
                      className="read-only"
                    />
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <div className="payment-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || !vpnAllowed}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Processing Payment...
                        </>
                      ) : (
                        `Pay $${getPlanPrice(plan)}`
                      )}
                    </button>
                  </div>

                  <div className="payment-security">
                    <div className="secure-badge">
                      🔒 Secure Payment • SSL Encrypted • PCI Compliant
                    </div>
                    <p className="security-note">
                      Your payment information is encrypted and secure. 
                      We never store your card details.
                    </p>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;