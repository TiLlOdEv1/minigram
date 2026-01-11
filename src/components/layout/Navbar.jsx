// minigram/src/components/layout/Navbar.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { 
  Home, Search, Compass, Video, MessageCircle, 
  Heart, PlusSquare, User, Crown, Bell, LogOut,
  Zap, Sparkles, TrendingUp, Users, Gift
} from 'lucide-react'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { isPremium, verified } = useSelector((state) => state.premium)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-minigram-primary to-minigram-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {isPremium && (
                <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-yellow-400" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-minigram-primary to-minigram-secondary bg-clip-text text-transparent">
                Minigram
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
                Connect • Share • Inspire
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                placeholder="🔍 Search users, hashtags, or locations..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-minigram-primary focus:ring-2 focus:ring-minigram-primary/20 outline-none transition-all placeholder-gray-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-minigram-primary">
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <NavIcon icon={Home} label="Home" path="/" />
                <NavIcon icon={Compass} label="Explore" path="/explore" />
                <NavIcon icon={Video} label="Reels" path="/reels" />
                <NavIcon icon={MessageCircle} label="Messages" path="/messages" />
                
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                  >
                    <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      3
                    </span>
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
                      <h3 className="font-bold mb-3 flex items-center">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </h3>
                      <div className="space-y-2">
                        <NotificationItem icon="❤️" text="John liked your post" time="2m" />
                        <NotificationItem icon="👤" text="New follower: Jane" time="15m" />
                        <NotificationItem icon="💬" text="Sarah commented" time="1h" />
                        {!isPremium && (
                          <NotificationItem 
                            icon="👑" 
                            text="Get Minigram Verified!" 
                            time="Special" 
                            premium 
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Create Post */}
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <PlusSquare className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>

                {/* Profile */}
                <Link to="/profile" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-minigram-primary to-minigram-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    {isPremium && (
                      <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-minigram-primary to-minigram-secondary text-white font-medium hover:opacity-90 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-around py-3">
          <MobileNavIcon icon={Home} label="Home" path="/" />
          <MobileNavIcon icon={Search} label="Search" path="/search" />
          <MobileNavIcon icon={PlusSquare} label="Create" path="/create" />
          <MobileNavIcon icon={Compass} label="Explore" path="/explore" />
          <MobileNavIcon icon={User} label="Profile" path="/profile" />
        </div>
      </div>
    </nav>
  )
}

// Helper components
const NavIcon = ({ icon: Icon, label, path }) => (
  <Link
    to={path}
    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative group"
    title={label}
  >
    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
      {label}
    </span>
  </Link>
)

const MobileNavIcon = ({ icon: Icon, label, path }) => (
  <Link to={path} className="flex flex-col items-center">
    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
    <span className="text-xs mt-1">{label}</span>
  </Link>
)

const NotificationItem = ({ icon, text, time, premium = false }) => (
  <div className={`p-3 rounded-lg ${premium ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm">{text}</span>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  </div>
)

export default Navbar