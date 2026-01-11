// minigram/src/components/premium/VerifiedBadge.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Sparkles, Zap, Shield, Star, Gem, Check } from 'lucide-react'

const VerifiedBadge = ({ 
  user, 
  size = "md", 
  showPopup = true,
  onClick 
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  const sizes = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-1.5",
    lg: "text-lg px-4 py-2",
    xl: "text-xl px-5 py-2.5"
  }

  const handleClick = () => {
    if (onClick) onClick()
    if (showPopup) setShowTooltip(!showTooltip)
  }

  return (
    <div className="relative inline-block">
      {/* Main Badge */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`
          ${sizes[size]}
          relative inline-flex items-center gap-2 rounded-full
          bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500
          text-white font-bold cursor-pointer shadow-lg
          hover:shadow-xl transition-all duration-300
          group overflow-hidden
        `}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        {/* Icons */}
        <div className="relative flex items-center gap-2 z-10">
          <Crown className="w-5 h-5" />
          <span>Minigram Verified</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>

        {/* Premium indicator dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50"
        >
          <div className="text-center mb-4">
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-spin" />
            </div>
            <h3 className="font-bold text-lg">Minigram Verified</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Premium Account Features
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span>Verified Badge</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Exclusive Filters</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Priority Support</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Enhanced Security</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Gem className="w-4 h-4 text-pink-500" />
              <span>Ad-Free Experience</span>
            </div>
          </div>

          {/* Subscribe button */}
          <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-minigram-primary to-minigram-secondary text-white font-bold hover:opacity-90 transition">
            Get Verified - $9.99/month
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            ⚡ Cancel anytime • 🔒 Secure payment
          </p>
        </motion.div>
      )}
    </div>
  )
}

// Premium Profile Badge for user profiles
export const PremiumProfileBadge = ({ user }) => {
  return (
    <div className="relative group">
      {/* Glowing effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500" />
      
      {/* Main badge */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col items-center">
          {/* Animated crown */}
          <div className="relative mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
            >
              <Crown className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Floating stars */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-bounce" />
            <Star className="absolute -bottom-2 -left-2 w-6 h-6 text-orange-300 animate-pulse" />
          </div>
          
          {/* User info */}
          <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {user?.name || "Premium User"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Minigram Verified Member
            </span>
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 w-full">
            <div className="text-center">
              <div className="text-2xl font-bold">✨</div>
              <div className="text-xs text-gray-500">Premium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">🔒</div>
              <div className="text-xs text-gray-500">Secure</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">⚡</div>
              <div className="text-xs text-gray-500">Priority</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifiedBadge