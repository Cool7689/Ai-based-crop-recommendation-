import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import VoiceInput from '../components/VoiceInput';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Menu, 
  Home,
  User as UserIcon,
  Search,
  Cloud,
  TrendingUp,
  LogOut
} from 'lucide-react';

const Chat = () => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    createNewSession();
  }, []);

  const createNewSession = async () => {
    try {
      const response = await axios.post('/api/chat/session', {
        title: 'New Chat Session',
        language: language || user?.preferredLanguage || 'English'
      });
      setSessionId(response.data.data.sessionId);
      
      // Add welcome message
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Hello ${user?.name}! I'm your AI agricultural assistant. I can help you with crop recommendations, farming advice, weather information, and market insights. How can I help you today?`,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create chat session');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await axios.post('/api/chat/message', {
        sessionId,
        content: inputMessage
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.data.aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening);
      // Voice recognition implementation would go here
      toast.info('Voice input feature coming soon!');
    } else {
      toast.error('Voice recognition not supported in this browser');
    }
  };

  const handleVoiceInput = (transcript) => {
    setInputMessage(transcript);
  };

  const handleVoiceOutput = (message) => {
    // This will be handled by the VoiceInput component
    return message;
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 6 && month <= 9) return 'Kharif';
    if (month >= 10 && month <= 12) return 'Rabi';
    if (month >= 1 && month <= 2) return 'Rabi';
    return 'Zaid';
  };

  const quickActions = [
    {
      title: 'Crop Recommendation',
      action: () => {
        const message = `I need crop recommendations for my farm. I have ${user?.farmDetails?.totalLandArea || '5'} acres of ${user?.farmDetails?.soilType || 'Clay'} soil in ${user?.location?.state || 'Maharashtra'}. Current season is ${getCurrentSeason()}.`;
        setInputMessage(message);
      }
    },
    {
      title: 'Weather Info',
      action: () => {
        const message = `What's the weather forecast for ${user?.location?.district || 'my area'}?`;
        setInputMessage(message);
      }
    },
    {
      title: 'Market Prices',
      action: () => {
        const message = 'What are the current market prices for rice and wheat?';
        setInputMessage(message);
      }
    },
    {
      title: 'Farming Tips',
      action: () => {
        const message = 'Give me some farming tips for the current season.';
        setInputMessage(message);
      }
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Crop AI Assistant</h2>
          <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/')}
                className="flex items-center w-full px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <Home className="w-5 h-5 mr-3" />
                {t('dashboard')}
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/crops')}
                className="flex items-center w-full px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <Search className="w-5 h-5 mr-3" />
                {t('crops')}
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/weather')}
                className="flex items-center w-full px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <Cloud className="w-5 h-5 mr-3" />
                {t('weather')}
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/market')}
                className="flex items-center w-full px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                {t('market')}
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center w-full px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <UserIcon className="w-5 h-5 mr-3" />
                {t('profile')}
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-red-600 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {t('logout')}
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{t('chat')} Assistant</h1>
              <p className="text-sm text-gray-600">Get personalized farming advice</p>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">AI Online</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 border-b">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
              >
                {action.title}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-primary-600' : 'bg-gray-200'}`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="chat-bubble-ai">
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('typeMessage')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="1"
                disabled={isLoading}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Voice Input/Output Controls */}
          <div className="mt-3 flex items-center justify-between">
            <VoiceInput 
              onVoiceInput={handleVoiceInput}
              onVoiceOutput={handleVoiceOutput}
              message={messages.length > 0 ? messages[messages.length - 1]?.content : ''}
            />
            <p className="text-xs text-gray-500">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;


