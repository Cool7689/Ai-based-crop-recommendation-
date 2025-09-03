import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Search, 
  Cloud, 
  TrendingUp, 
  User, 
  LogOut,
  Bot,
  Calendar,
  MapPin,
  Droplets
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 6 && month <= 9) return 'Kharif';
    if (month >= 10 && month <= 12) return 'Rabi';
    if (month >= 1 && month <= 2) return 'Rabi';
    return 'Zaid';
  };

  const quickActions = [
    {
      title: 'Chat with AI',
      description: 'Get personalized farming advice',
      icon: <Bot className="w-6 h-6" />,
      color: 'bg-primary-500',
      onClick: () => navigate('/chat')
    },
    {
      title: 'Crop Search',
      description: 'Browse crop information',
      icon: <Search className="w-6 h-6" />,
      color: 'bg-success-500',
      onClick: () => navigate('/crops')
    },
    {
      title: 'Weather',
      description: 'Check weather forecast',
      icon: <Cloud className="w-6 h-6" />,
      color: 'bg-blue-500',
      onClick: () => navigate('/weather')
    },
    {
      title: 'Market Prices',
      description: 'View market trends',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-warning-500',
      onClick: () => navigate('/market')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">🌾</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Crop AI Assistant</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Get personalized farming advice and stay updated with the latest agricultural insights.
          </p>
        </div>

        {/* Farm Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.location?.district}, {user?.location?.state}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <Droplets className="w-5 h-5 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Soil Type</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.farmDetails?.soilType}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Calendar className="w-5 h-5 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Season</p>
                <p className="text-lg font-semibold text-gray-900">
                  {getCurrentSeason()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Land Area</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.farmDetails?.totalLandArea} acres
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="card hover:shadow-md transition-shadow cursor-pointer text-left"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    {action.icon}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">
                Welcome to Crop AI Assistant! Start by chatting with our AI for personalized recommendations.
              </span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">
                Current season: {getCurrentSeason()}. Perfect time to plan your crops!
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


