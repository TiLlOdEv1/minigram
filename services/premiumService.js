// src/services/premiumService.js
class PremiumService {
  constructor() {
    this.premiumUsers = new Map()
    this.loadFromStorage()
  }

  // Subscribe to premium
  async subscribe(userId, plan, paymentData) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Check if user exists
          const user = await this.getUser(userId)
          if (!user) {
            reject(new Error('User not found'))
            return
          }

          // Process payment
          const paymentResult = await this.processPayment(paymentData, plan)
          
          if (!paymentResult.success) {
            reject(new Error(paymentResult.error))
            return
          }

          // Calculate subscription end date
          const subscriptionEnd = new Date()
          if (plan === 'monthly') {
            subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)
          } else if (plan === 'yearly') {
            subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1)
          } else {
            subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 100) // Lifetime
          }

          // Update user premium status
          const premiumUser = {
            ...user,
            isPremium: true,
            isVerified: true,
            plan,
            subscriptionStart: new Date().toISOString(),
            subscriptionEnd: subscriptionEnd.toISOString(),
            paymentId: paymentResult.paymentId,
            lastPayment: new Date().toISOString()
          }

          // Save to storage
          this.premiumUsers.set(userId, premiumUser)
          this.saveToStorage()

          // Send welcome email
          await this.sendWelcomeEmail(premiumUser)

          resolve({
            success: true,
            user: premiumUser,
            payment: paymentResult,
            message: '🎉 Welcome to Minigram Verified!'
          })

        } catch (error) {
          reject(error)
        }
      }, 1500)
    })
  }

  // Check subscription status
  async checkStatus(userId) {
    const user = this.premiumUsers.get(userId)
    
    if (!user || !user.isPremium) {
      return {
        isPremium: false,
        isVerified: false,
        message: 'Not subscribed'
      }
    }

    const now = new Date()
    const subscriptionEnd = new Date(user.subscriptionEnd)
    
    if (now > subscriptionEnd) {
      // Subscription expired
      user.isPremium = false
      user.isVerified = false
      this.premiumUsers.set(userId, user)
      this.saveToStorage()
      
      return {
        isPremium: false,
        isVerified: false,
        expired: true,
        message: 'Subscription expired'
      }
    }

    // Calculate days remaining
    const daysRemaining = Math.ceil((subscriptionEnd - now) / (1000 * 60 * 60 * 24))

    return {
      isPremium: true,
      isVerified: true,
      plan: user.plan,
      subscriptionEnd: user.subscriptionEnd,
      daysRemaining,
      nextPayment: this.calculateNextPayment(user),
      features: this.getFeatures(user.plan)
    }
  }

  // Cancel subscription
  async cancel(userId) {
    const user = this.premiumUsers.get(userId)
    
    if (!user) {
      throw new Error('User not found')
    }

    // Update user status
    user.isPremium = false
    user.isVerified = false
    user.cancelledAt = new Date().toISOString()
    
    this.premiumUsers.set(userId, user)
    this.saveToStorage()

    // Send cancellation email
    await this.sendCancellationEmail(user)

    return {
      success: true,
      message: 'Subscription cancelled successfully',
      refundEligible: this.isRefundEligible(user)
    }
  }

  // Get premium features
  getFeatures(plan) {
    const baseFeatures = [
      '✅ Verified Blue Badge',
      '✨ Premium Profile Effects',
      '⚡ Priority Support',
      '🚫 Ad-Free Experience',
      '🔒 Enhanced Security'
    ]

    const premiumFeatures = {
      monthly: [...baseFeatures],
      yearly: [...baseFeatures, '🎨 Exclusive Filters', '📊 Advanced Analytics'],
      lifetime: [...baseFeatures, '🎨 Exclusive Filters', '📊 Advanced Analytics', '👑 VIP Status', '💎 Lifetime Updates']
    }

    return premiumFeatures[plan] || baseFeatures
  }

  // Calculate next payment date
  calculateNextPayment(user) {
    const lastPayment = new Date(user.lastPayment)
    const nextPayment = new Date(lastPayment)
    
    if (user.plan === 'monthly') {
      nextPayment.setMonth(nextPayment.getMonth() + 1)
    } else if (user.plan === 'yearly') {
      nextPayment.setFullYear(nextPayment.getFullYear() + 1)
    }
    
    return nextPayment.toISOString()
  }

  // Check refund eligibility
  isRefundEligible(user) {
    const subscriptionStart = new Date(user.subscriptionStart)
    const now = new Date()
    const daysSinceStart = Math.floor((now - subscriptionStart) / (1000 * 60 * 60 * 24))
    
    return daysSinceStart <= 14 // 14-day refund policy
  }

  // Mock payment processing
  async processPayment(paymentData, plan) {
    console.log('Processing payment:', { paymentData, plan })
    
    // Simulate payment gateway
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Randomly fail 5% of payments
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: 'Payment declined by bank'
      }
    }

    return {
      success: true,
      paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: this.getPlanPrice(plan),
      currency: 'USD'
    }
  }

  // Get plan price
  getPlanPrice(plan) {
    const prices = {
      monthly: 9.99,
      yearly: 99.99,
      lifetime: 299.99
    }
    
    return prices[plan] || 9.99
  }

  // Mock user data
  async getUser(userId) {
    const users = {
      '1': {
        id: '1',
        email: 'user@example.com',
        name: 'Test User'
      }
    }
    
    return users[userId] || null
  }

  // Mock email sending
  async sendWelcomeEmail(user) {
    console.log('📧 Sending welcome email to:', user.email)
    return { sent: true }
  }

  async sendCancellationEmail(user) {
    console.log('📧 Sending cancellation email to:', user.email)
    return { sent: true }
  }

  // Storage methods
  saveToStorage() {
    try {
      const data = Object.fromEntries(this.premiumUsers)
      localStorage.setItem('minigram_premium_users', JSON.stringify(data))
    } catch (error) {
      console.error('Error saving premium users:', error)
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('minigram_premium_users')
      if (data) {
        const users = JSON.parse(data)
        this.premiumUsers = new Map(Object.entries(users))
      }
    } catch (error) {
      console.error('Error loading premium users:', error)
    }
  }
}

export const premiumService = new PremiumService()