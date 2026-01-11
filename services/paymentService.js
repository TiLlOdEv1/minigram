// src/services/paymentService.js
class PaymentService {
  constructor() {
    this.API_KEY = 'pk_test_mock_key_123456789' // Test API key
    this.prices = {
      monthly: { amount: 999, currency: 'usd' }, // $9.99
      yearly: { amount: 9999, currency: 'usd' }, // $99.99
      lifetime: { amount: 29999, currency: 'usd' } // $299.99
    }
  }

  // Create payment intent
  async createPaymentIntent(plan, user) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const amount = this.prices[plan].amount
        const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
        
        resolve({
          success: true,
          clientSecret,
          amount,
          currency: 'usd',
          plan,
          user: {
            id: user.id,
            email: user.email
          }
        })
      }, 1000)
    })
  }

  // Process payment
  async processPayment(paymentMethodId, plan, user) {
    console.log('💰 Processing payment:', { paymentMethodId, plan, user })
    
    // Simulate payment processing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate fraud detection
        const isFraud = paymentMethodId.includes('test') || 
                       paymentMethodId.includes('fake') ||
                       paymentMethodId.includes('4242424242424242')
        
        if (isFraud) {
          reject(new Error('Payment declined: Fraud detected'))
          return
        }

        // Simulate successful payment
        const paymentId = `pay_${Date.now()}`
        const subscriptionEnd = new Date()
        
        if (plan === 'monthly') {
          subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)
        } else if (plan === 'yearly') {
          subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1)
        } else {
          subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 100) // Lifetime
        }

        resolve({
          success: true,
          paymentId,
          amount: this.prices[plan].amount,
          plan,
          subscriptionEnd: subscriptionEnd.toISOString(),
          receiptUrl: `https://minigram.com/receipt/${paymentId}`,
          user: {
            ...user,
            isPremium: true,
            isVerified: true
          }
        })
      }, 2000)
    })
  }

  // Check VPN (mock)
  async checkVPN(ip) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate VPN check
        const isVPN = ip.includes('192.168') || 
                     ip.includes('10.0') || 
                     Math.random() < 0.1 // 10% chance of VPN
        
        resolve({
          isVPN,
          message: isVPN ? 'VPN detected. Please disable VPN to proceed.' : 'No VPN detected'
        })
      }, 500)
    })
  }

  // Validate card
  validateCard(cardNumber, expiry, cvc) {
    // Remove spaces
    const cleanNumber = cardNumber.replace(/\s/g, '')
    
    // Basic validation
    if (cleanNumber.length !== 16 || !/^\d+$/.test(cleanNumber)) {
      return { valid: false, error: 'Invalid card number' }
    }

    // Luhn algorithm check
    if (!this.luhnCheck(cleanNumber)) {
      return { valid: false, error: 'Invalid card number' }
    }

    // Check expiry
    const [month, year] = expiry.split('/')
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      return { valid: false, error: 'Invalid expiry month' }
    }
    
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return { valid: false, error: 'Card expired' }
    }

    // Check CVC
    if (cvc.length < 3 || cvc.length > 4 || !/^\d+$/.test(cvc)) {
      return { valid: false, error: 'Invalid CVC' }
    }

    // Block test cards
    const testCards = [
      '4242424242424242',
      '4000056655665556',
      '5555555555554444',
      '2223003122003222'
    ]
    
    if (testCards.includes(cleanNumber)) {
      return { valid: false, error: 'Test cards are not allowed' }
    }

    return { valid: true, cardType: this.getCardType(cleanNumber) }
  }

  // Luhn algorithm
  luhnCheck(cardNumber) {
    let sum = 0
    let shouldDouble = false
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i))
      
      if (shouldDouble) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      
      sum += digit
      shouldDouble = !shouldDouble
    }
    
    return sum % 10 === 0
  }

  // Get card type
  getCardType(cardNumber) {
    if (/^4/.test(cardNumber)) return 'visa'
    if (/^5[1-5]/.test(cardNumber)) return 'mastercard'
    if (/^3[47]/.test(cardNumber)) return 'amex'
    if (/^6(?:011|5)/.test(cardNumber)) return 'discover'
    return 'unknown'
  }

  // Get user's IP (mock)
  getUserIP() {
    // In real app, get from backend
    const ips = [
      '123.456.789.101',
      '98.76.54.321',
      '192.168.1.1', // VPN
      '10.0.0.1' // VPN
    ]
    
    return ips[Math.floor(Math.random() * ips.length)]
  }
}

export const paymentService = new PaymentService()