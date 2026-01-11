import React, { useState } from 'react'
import './PremiumModal.css'

const PremiumModal = ({ isOpen, onClose, onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  if (!isOpen) return null

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '35,990 UZS',
      period: 'per month',
      discount: null,
      popular: false
    },
    {
      id: 'annual',
      name: 'Annual',
      price: '269,990 UZS',
      originalPrice: '431,990 UZS',
      period: 'per year',
      discount: '37%',
      popular: true,
      monthlyEquivalent: '22,499 UZS / month'
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '999,990 UZS',
      period: 'one-time payment',
      discount: 'Best Value',
      popular: false
    }
  ]

  const features = [
    {
      icon: '🎬',
      title: 'Stories',
      description: 'Unlimited posting, priority order, stealth mode, permanent view history and more.'
    },
    {
      icon: '💾',
      title: 'Unlimited Cloud Storage',
      description: '4 GB per each document, unlimited storage for your chats and media overall.'
    },
    {
      icon: '📈',
      title: 'Doubled Limits',
      description: 'Up to 1000 channels, 30 folders, 10 pins, 20 public links, 4 accounts and more.'
    },
    {
      icon: '💼',
      title: 'Minigram Business',
      description: 'Upgrade your account with business features such as location, opening hours and quick replies.'
    },
    {
      icon: '👁️',
      title: 'Last Seen Times',
      description: 'View the last seen and read times of others even if you hide yours.'
    },
    {
      icon: '🎤',
      title: 'Voice-to-Text Conversion',
      description: 'Convert voice messages to text instantly.'
    }
  ]

  return (
    <div className="modal-overlay premium-modal-overlay" onClick={onClose}>
      <div className="modal-content premium-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="premium-header">
          <div className="premium-logo">
            <span className="logo-icon">M</span>
            <span className="logo-text">Minigram <strong>Premium</strong></span>
          </div>
          <h1>Go beyond the limits</h1>
          <p className="premium-subtitle">
            Unlock dozens of exclusive features by subscribing to Minigram Premium.
          </p>
        </div>

        <div className="plans-container">
          {plans.map(plan => (
            <div 
              key={plan.id}
              className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && <div className="popular-badge">MOST POPULAR</div>}
              {plan.discount && <div className="discount-badge">{plan.discount}</div>}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <div className="current-price">{plan.price}</div>
                  {plan.originalPrice && (
                    <div className="original-price">{plan.originalPrice}</div>
                  )}
                  {plan.monthlyEquivalent && (
                    <div className="monthly-equivalent">{plan.monthlyEquivalent}</div>
                  )}
                </div>
                <div className="period">{plan.period}</div>
              </div>

              <div className="plan-features">
                <div className="feature-check">✓</div>
                <span>All Premium Features</span>
              </div>

              {plan.id === 'annual' && (
                <div className="savings">
                  <span className="savings-amount">Save 162,000 UZS</span>
                  <span className="savings-text">compared to monthly plan</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="features-section">
          <h2>Everything included in Minigram Premium</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="premium-footer">
          <div className="total-price">
            <span>Total: </span>
            <strong>{plans.find(p => p.id === selectedPlan)?.price}</strong>
          </div>
          
          <button 
            className="btn btn-premium subscribe-btn"
            onClick={() => onSubscribe(selectedPlan)}
          >
            <span className="btn-icon">👑</span>
            Subscribe to Minigram Premium
          </button>
          
          <p className="payment-info">
            Payment will be charged to your chosen method. Subscriptions auto-renew unless canceled.
          </p>
          
          <div className="trust-badges">
            <span className="trust-badge">🔒 Secure Payment</span>
            <span className="trust-badge">✓ 30-Day Guarantee</span>
            <span className="trust-badge">⭐ 4.9/5 Rating</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumModal