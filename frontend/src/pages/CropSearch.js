import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CropSearch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">🌾</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Crop AI Assistant</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-primary-600 hover:text-primary-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Crop Search</h2>
          <p className="text-gray-600">Crop search and information coming soon!</p>
        </div>
      </main>
    </div>
  );
};

export default CropSearch;


