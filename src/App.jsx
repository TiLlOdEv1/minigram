import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import AiAssistant from './components/ai/AiAssistant';
import VideoChat from './components/chat/VideoChat';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Reels from './pages/Reels';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Premium from './pages/Premium';

// Styles
import './styles/globals.css';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('minigram_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: '1',
      username: 'john_doe',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Digital creator & entrepreneur',
      isPremium: true,
      isVerified: true,
      followers: 1250,
      following: 340,
      posts: 47,
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      plan: 'monthly'
    };
  });

  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showVideoChat, setShowVideoChat] = useState(false);
  const [videoCallData, setVideoCallData] = useState(null);

  // Save user to localStorage
  useEffect(() => {
    localStorage.setItem('minigram_user', JSON.stringify(user));
  }, [user]);

  const handleAiAssistantOpen = () => {
    setShowAiAssistant(true);
  };

  const handleVideoCall = (peerUser) => {
    setVideoCallData({
      peerUser,
      isCaller: true
    });
    setShowVideoChat(true);
  };

  const handleIncomingCall = (peerUser) => {
    setVideoCallData({
      peerUser,
      isCaller: false
    });
    setShowVideoChat(true);
  };

  const handlePremiumSubscribe = (plan) => {
    const subscriptionEnd = new Date();
    if (plan === 'monthly') subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    else if (plan === 'yearly') subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
    else subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 100);

    setUser(prev => ({
      ...prev,
      isPremium: true,
      plan,
      subscriptionEnd: subscriptionEnd.toISOString(),
      isVerified: true
    }));
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navbar 
            user={user}
            onAiAssistantClick={handleAiAssistantOpen}
            onVideoCallClick={() => handleVideoCall({
              id: '2',
              name: 'Sarah Johnson',
              avatar: 'https://i.pravatar.cc/150?img=5',
              isVerified: true,
              isPremium: true
            })}
          />
          
          <div className="app-container">
            <Sidebar 
              user={user}
              onAiAssistantClick={handleAiAssistantOpen}
            />
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home user={user} onVideoCall={handleVideoCall} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:username" element={<Profile user={user} />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/reels" element={<Reels />} />
                <Route path="/messages" element={<Messages onVideoCall={handleVideoCall} />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
                <Route path="/premium" element={<Premium user={user} onSubscribe={handlePremiumSubscribe} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
          
          <BottomNav />
          
          {/* AI Assistant */}
          <AiAssistant
            isOpen={showAiAssistant}
            onClose={() => setShowAiAssistant(false)}
            user={user}
          />
          
          {/* Video Chat */}
          {videoCallData && (
            <VideoChat
              isOpen={showVideoChat}
              onClose={() => {
                setShowVideoChat(false);
                setVideoCallData(null);
              }}
              user={user}
              peerUser={videoCallData.peerUser}
              isCaller={videoCallData.isCaller}
              onCallStart={() => console.log('Call started')}
              onCallEnd={() => console.log('Call ended')}
            />
          )}
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--success-color)',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--danger-color)',
                  secondary: 'white',
                },
              },
            }}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;