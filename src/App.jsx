// src/App.jsx
import React, { useState, useEffect } from 'react'
import PaymentModal from './components/premium/PaymentModal'
import VerifiedBadge from './components/premium/VerifiedBadge'
import './App.css'

function App() {
  const [user, setUser] = useState({
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    isPremium: false,
    isVerified: false,
    balance: 0,
    transactions: []
  })

  const [showPayment, setShowPayment] = useState(false)
  const [revenue, setRevenue] = useState(0)
  const [premiumUsers, setPremiumUsers] = useState([])

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('minigram_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    // Load revenue (in real app, from backend)
    const savedRevenue = localStorage.getItem('minigram_revenue') || '0'
    setRevenue(parseFloat(savedRevenue))
  }, [])

  const handlePaymentSuccess = (paymentData) => {
    // Update user
    const updatedUser = {
      ...user,
      isPremium: true,
      isVerified: true,
      subscriptionEnd: paymentData.subscriptionEnd,
      plan: paymentData.plan,
      transactions: [
        ...user.transactions,
        {
          id: paymentData.paymentId,
          amount: paymentData.amount,
          plan: paymentData.plan,
          date: new Date().toISOString(),
          status: 'completed'
        }
      ]
    }
    
    setUser(updatedUser)
    localStorage.setItem('minigram_user', JSON.stringify(updatedUser))
    
    // Update revenue (💰 PUL TUSHDI!)
    const newRevenue = revenue + (paymentData.amount / 100)
    setRevenue(newRevenue)
    localStorage.setItem('minigram_revenue', newRevenue.toString())
    
    // Add to premium users
    setPremiumUsers(prev => [...prev, {
      id: user.id,
      username: user.username,
      plan: paymentData.plan,
      amount: paymentData.amount / 100,
      date: new Date().toISOString()
    }])
    
    alert(`🎉 Payment successful! $${paymentData.amount / 100} added to your account.`)
  }

  const handleCancelPremium = () => {
    const updatedUser = {
      ...user,
      isPremium: false,
      isVerified: false,
      subscriptionEnd: null,
      plan: null
    }
    
    setUser(updatedUser)
    localStorage.setItem('minigram_user', JSON.stringify(updatedUser))
    alert('Premium subscription cancelled.')
  }

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo">
            <span className="logo-icon">M</span>
            <span className="logo-text">Minigram</span>
          </div>
          {user.isPremium && <VerifiedBadge />}
        </div>

        <div className="navbar-stats">
          <div className="stat">
            <span className="stat-label">Revenue:</span>
            <span className="stat-value">${revenue.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Premium Users:</span>
            <span className="stat-value">{premiumUsers.length}</span>
          </div>
        </div>

        <div className="navbar-actions">
          {user.isPremium ? (
            <>
              <button className="btn btn-premium">
                👑 Premium Active
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleCancelPremium}
              >
                Cancel Premium
              </button>
            </>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => setShowPayment(true)}
            >
              ⭐ Get Minigram Verified
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        {/* Dashboard */}
        <div className="dashboard">
          <div className="dashboard-card">
            <h2>💰 Revenue Dashboard</h2>
            <div className="revenue-stats">
              <div className="revenue-stat">
                <div className="revenue-label">Total Revenue</div>
                <div className="revenue-value">${revenue.toFixed(2)}</div>
              </div>
              <div className="revenue-stat">
                <div className="revenue-label">Premium Users</div>
                <div className="revenue-value">{premiumUsers.length}</div>
              </div>
              <div className="revenue-stat">
                <div className="revenue-label">Conversion Rate</div>
                <div className="revenue-value">{premiumUsers.length > 0 ? '5%' : '0%'}</div>
              </div>
            </div>
          </div>

          {/* Premium Users List */}
          <div className="dashboard-card">
            <h2>👑 Premium Users</h2>
            {premiumUsers.length > 0 ? (
              <div className="premium-users-list">
                {premiumUsers.map((premiumUser, index) => (
                  <div key={index} className="premium-user">
                    <div className="user-info">
                      <span className="user-avatar">👤</span>
                      <span className="user-name">{premiumUser.username}</span>
                    </div>
                    <div className="user-plan">
                      <span className={`plan-badge ${premiumUser.plan}`}>
                        {premiumUser.plan}
                      </span>
                    </div>
                    <div className="user-amount">
                      ${premiumUser.amount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No premium users yet</p>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="profile-card">
          <h2>👤 Your Profile</h2>
          <div className="profile-info">
            <div className="profile-field">
              <span className="field-label">Username:</span>
              <span className="field-value">{user.username}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{user.email}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Status:</span>
              <span className={`status-badge ${user.isPremium ? 'premium' : 'basic'}`}>
                {user.isPremium ? '👑 Premium' : '⭐ Basic'}
              </span>
            </div>
            {user.isPremium && (
              <>
                <div className="profile-field">
                  <span className="field-label">Plan:</span>
                  <span className="field-value">{user.plan}</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Subscription End:</span>
                  <span className="field-value">
                    {new Date(user.subscriptionEnd).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Transactions */}
          {user.transactions.length > 0 && (
            <div className="transactions">
              <h3>💳 Transaction History</h3>
              <div className="transactions-list">
                {user.transactions.map((transaction, index) => (
                  <div key={index} className="transaction">
                    <div className="transaction-id">{transaction.id}</div>
                    <div className="transaction-amount">${transaction.amount / 100}</div>
                    <div className="transaction-plan">{transaction.plan}</div>
                    <div className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                    <div className="transaction-status completed">{transaction.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        user={user}
      />
    </div>
  )
}

export default App