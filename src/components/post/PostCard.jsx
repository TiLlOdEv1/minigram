// minigram/src/components/post/PostCard.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, MessageCircle, Send, Bookmark, 
  MoreVertical, Share2, Flag, 
  BarChart2, Eye, Download, Copy
} from 'lucide-react'
import VerifiedBadge from '../premium/VerifiedBadge'

const PostCard = ({ post, user }) => {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    // API call would go here
  }

  const handleShare = (platform) => {
    console.log(`Sharing to ${platform}`)
    setShowShareMenu(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Post Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* User avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-minigram-primary to-minigram-secondary" />
              {user?.isPremium && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              )}
            </div>
            
            {/* User info */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{user?.username}</span>
                {user?.isPremium && <VerifiedBadge size="sm" showPopup={false} />}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>📍 {post?.location || "Toshkent"}</span>
                <span>•</span>
                <span>{post?.time || "2h ago"}</span>
              </div>
            </div>
          </div>

          {/* Options menu */}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  View Analytics
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <hr className="border-gray-200 dark:border-gray-700" />
                <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Report Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        {post?.caption && (
          <p className="mt-3 text-gray-800 dark:text-gray-200">
            {post.caption}
            {post?.hashtags?.map((tag, index) => (
              <span key={index} className="text-blue-500 hover:underline ml-1 cursor-pointer">
                {tag}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Post Media */}
      <div className="relative">
        <img
          src={post?.image || "https://via.placeholder.com/600x400"}
          alt="Post"
          className="w-full h-auto max-h-[500px] object-cover"
        />
        
        {/* Premium overlay for premium users */}
        {user?.isPremium && (
          <div className="absolute top-4 right-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm flex items-center gap-1">
              <span>👑</span>
              <span>Premium Post</span>
            </div>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {/* Like button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center gap-2 ${liked ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
            >
              {liked ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-red-500"
                >
                  <Heart className="w-6 h-6 fill-current" />
                </motion.div>
              ) : (
                <Heart className="w-6 h-6" />
              )}
              <span className="font-medium">{post?.likes + (liked ? 1 : 0)}</span>
            </motion.button>

            {/* Comment button */}
            <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500">
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{post?.comments || 0}</span>
            </button>

            {/* Share button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-500"
              >
                <Send className="w-6 h-6" />
                <span className="font-medium">{post?.shares || 0}</span>
              </button>
              
              {showShareMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 z-10">
                  <h4 className="font-bold mb-2 text-sm">Share to:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <ShareButton icon="📱" label="Story" onClick={() => handleShare('story')} />
                    <ShareButton icon="💬" label="DM" onClick={() => handleShare('dm')} />
                    <ShareButton icon="📋" label="Copy" onClick={() => handleShare('copy')} />
                    <ShareButton icon="🔗" label="Link" onClick={() => handleShare('link')} />
                    <ShareButton icon="📧" label="Email" onClick={() => handleShare('email')} />
                    <ShareButton icon="🐦" label="Twitter" onClick={() => handleShare('twitter')} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={() => setSaved(!saved)}
            className={`${saved ? 'text-yellow-500' : 'text-gray-700 dark:text-gray-300'} hover:text-yellow-500`}
          >
            {saved ? (
              <Bookmark className="w-6 h-6 fill-current" />
            ) : (
              <Bookmark className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Views */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Eye className="w-4 h-4" />
          <span>{post?.views?.toLocaleString() || '1,234'} views</span>
        </div>

        {/* Add comment input */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />
          <input
            type="text"
            placeholder="💬 Add a comment..."
            className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm outline-none"
          />
          <button className="text-blue-500 font-medium text-sm hover:text-blue-600">
            Post
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const ShareButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
  >
    <span className="text-xl mb-1">{icon}</span>
    <span className="text-xs">{label}</span>
  </button>
)

export default PostCard