import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import CropSearch from './pages/CropSearch';
import Weather from './pages/Weather';
import Market from './pages/Market';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/crops" element={
            <PrivateRoute>
              <CropSearch />
            </PrivateRoute>
          } />
          <Route path="/weather" element={
            <PrivateRoute>
              <Weather />
            </PrivateRoute>
          } />
          <Route path="/market" element={
            <PrivateRoute>
              <Market />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;


