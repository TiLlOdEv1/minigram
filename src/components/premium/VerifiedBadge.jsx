import React, { useState } from 'react'
import './VerifiedBadge.css'

const VerifiedBadge = ({ user, onClick, size = 'medium', showPopup = true }) => {
  const [showModal, setShowModal] = useState(false)

  const sizes = {
    small: 'verified-badge-sm',
    medium: 'verified-badge-md',
    large: 'verified-badge-lg',
    xlarge: 'verified-badge-xl'
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (showPopup) {
      setShowModal(true)
    }
  }

  const VerifiedModal = () => {
    if (!showModal) return null

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content verified-modal" onClick={e => e.stopPropagation()}>
          <div className="verified-modal-header">
            <div className="verified-badge-xl">
              <div className="badge-glow"></div>
              <div className="badge-icon">✓</div>
            </div>
            <h2 className="text-gradient-gold">Minigram Verified</h2>
          </div>

          <div className="verified-modal-body">
            <p className="verified-description">
              <strong>{user?.name || 'This account'}</strong> is officially verified by Minigram. 
              The blue checkmark indicates that the account has been authenticated.
            </p>

            <div className="verified-features">
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div>
                  <h4>Authentic Identity</h4>
                  <p>Confirmed by Minigram verification team</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">⭐</div>
                <div>
                  <h4>Premium Features</h4>
                  <p>Access to exclusive Minigram tools</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">🚀</div>
                <div>
                  <h4>Priority Support</h4>
                  <p>24/7 dedicated customer service</p>
                </div>
              </div>
            </div>

            <div className="verified-stats">
              <div className="stat-item">
                <span className="stat-value">✓</span>
                <span className="stat-label">Verified Account</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">⭐</span>
                <span className="stat-label">Premium User</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">👑</span>
                <span className="stat-label">Exclusive Access</span>
              </div>
            </div>

            <button 
              className="btn btn-verified w-full"
              onClick={() => setShowModal(false)}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div 
        className={`verified-badge ${sizes[size]}`}
        onClick={handleClick}
        data-tooltip="Verified Account"
      >
        <div className="badge-glow"></div>
        <div className="badge-inner">
          <div className="badge-icon">✓</div>
          {user?.isPremium && (
            <div className="premium-crown">👑</div>
          )}
        </div>
        <div className="badge-rings">
          <div className="ring-1"></div>
          <div className="ring-2"></div>
          <div className="ring-3"></div>
        </div>
      </div>

      <VerifiedModal />
    </>
  )
}

export default VerifiedBadge