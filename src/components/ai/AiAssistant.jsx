import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { aiService } from '../../services/aiService';
import { toast } from 'react-hot-toast';
import './AiAssistant.css';

const AiAssistant = ({ isOpen, onClose, user, context }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [selectedMode, setSelectedMode] = useState('chat');
  const [conversationHistory, setConversationHistory] = useState([]);

  const messagesEndRef = useRef();
  const inputRef = useRef();

  // Initialize conversation
  useEffect(() => {
    if (isOpen) {
      const welcomeMessage = {
        id: Date.now(),
        text: `Hello ${user?.name || 'there'}! I'm your Minigram AI Assistant. How can I help you today?`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages([welcomeMessage]);
      setConversationHistory([welcomeMessage]);
      
      // Focus input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setAiTyping(true);

    try {
      const response = await aiService.getResponse(input, {
        mode: selectedMode,
        context: {
          user,
          conversationHistory,
          currentContext: context
        }
      });

      // Simulate AI typing
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.text,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: response.type || 'text',
          actions: response.actions,
          suggestions: response.suggestions
        };

        setMessages(prev => [...prev, aiMessage]);
        setConversationHistory(prev => [...prev, userMessage, aiMessage]);
        setAiTyping(false);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('AI Error:', error);
      toast.error('Failed to get AI response');
      setAiTyping(false);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action) => {
    const actionMessage = {
      id: Date.now(),
      text: action.text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'action'
    };

    setMessages(prev => [...prev, actionMessage]);
    setInput(action.text);
    
    // Auto send after short delay
    setTimeout(() => {
      handleSend();
    }, 300);
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClearChat = () => {
    const confirmation = window.confirm('Are you sure you want to clear the chat?');
    if (confirmation) {
      const welcomeMessage = {
        id: Date.now(),
        text: `Hi again! How can I help you?`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages([welcomeMessage]);
      setConversationHistory([welcomeMessage]);
      toast.success('Chat cleared');
    }
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const quickActions = [
    { text: 'Help me write a post', icon: '📝' },
    { text: 'Improve my profile bio', icon: '✨' },
    { text: 'Suggest trending hashtags', icon: '🔥' },
    { text: 'Create a story idea', icon: '🎬' },
    { text: 'Analyze my engagement', icon: '📊' },
    { text: 'Help with video editing', icon: '🎥' },
  ];

  const aiModes = [
    { id: 'chat', name: 'Chat', icon: '💬', description: 'General conversation' },
    { id: 'creative', name: 'Creative', icon: '🎨', description: 'Content creation' },
    { id: 'analytics', name: 'Analytics', icon: '📈', description: 'Data analysis' },
    { id: 'technical', name: 'Technical', icon: '⚙️', description: 'Technical support' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      className="ai-assistant-modal"
      overlayClassName="ai-assistant-overlay"
    >
      <div className="ai-assistant-container">
        {/* Header */}
        <div className="ai-header">
          <div className="ai-header-left">
            <div className="ai-avatar">
              <span className="ai-avatar-icon">🤖</span>
            </div>
            <div className="ai-header-info">
              <h3 className="ai-title">Minigram AI Assistant</h3>
              <div className="ai-status">
                <span className="status-dot"></span>
                <span className="status-text">Online</span>
              </div>
            </div>
          </div>
          <div className="ai-header-right">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClearChat}
              startIcon="🗑️"
            >
              Clear Chat
            </Button>
          </div>
        </div>

        {/* AI Modes */}
        <div className="ai-modes">
          {aiModes.map(mode => (
            <button
              key={mode.id}
              className={`ai-mode-btn ${selectedMode === mode.id ? 'active' : ''}`}
              onClick={() => setSelectedMode(mode.id)}
              title={mode.description}
            >
              <span className="mode-icon">{mode.icon}</span>
              <span className="mode-name">{mode.name}</span>
            </button>
          ))}
        </div>

        {/* Chat Container */}
        <div className="ai-chat-container">
          <div className="ai-messages">
            {messages.map(message => (
              <div
                key={message.id}
                className={`ai-message ${message.sender}`}
              >
                {message.sender === 'ai' && (
                  <div className="message-avatar">
                    <span className="avatar-icon">🤖</span>
                  </div>
                )}
                
                <div className="message-content">
                  <div className="message-text">
                    {message.text}
                  </div>
                  
                  {message.type === 'code' && (
                    <pre className="message-code">
                      <code>{message.text}</code>
                    </pre>
                  )}
                  
                  {message.actions && (
                    <div className="message-actions">
                      {message.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="small"
                          onClick={() => handleQuickAction({ text: action })}
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className="message-footer">
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    
                    <button
                      className="message-copy-btn"
                      onClick={() => handleCopyMessage(message.text)}
                      title="Copy message"
                    >
                      📋
                    </button>
                  </div>
                </div>
                
                {message.sender === 'user' && (
                  <div className="message-avatar user">
                    <span className="avatar-icon">👤</span>
                  </div>
                )}
              </div>
            ))}
            
            {aiTyping && (
              <div className="ai-message ai">
                <div className="message-avatar">
                  <span className="avatar-icon">🤖</span>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="ai-quick-actions">
          <div className="quick-actions-header">
            <span className="quick-actions-title">Quick Actions</span>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action)}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-text">{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="ai-input-area">
          <div className="ai-input-wrapper">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Minigram, content creation, analytics, or technical help..."
              fullWidth
              className="ai-input"
              disabled={loading}
              endIcon={
                loading ? (
                  <div className="input-loading-spinner"></div>
                ) : (
                  <button
                    className="send-button"
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )
              }
            />
          </div>
          
          <div className="ai-input-suggestions">
            <span className="suggestions-label">Try asking:</span>
            <button
              className="suggestion-btn"
              onClick={() => handleSuggestion('How can I increase my followers?')}
            >
              How can I increase my followers?
            </button>
            <button
              className="suggestion-btn"
              onClick={() => handleSuggestion('Write a caption for my travel photo')}
            >
              Write a caption for my travel photo
            </button>
            <button
              className="suggestion-btn"
              onClick={() => handleSuggestion('What are the best times to post?')}
            >
              What are the best times to post?
            </button>
          </div>
        </div>

        {/* Premium Features Badge */}
        {user?.isPremium && (
          <div className="ai-premium-badge">
            <span className="premium-icon">👑</span>
            <span className="premium-text">Premium AI Features Active</span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AiAssistant;