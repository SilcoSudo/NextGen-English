import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../models/AuthContext';

function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          throw new Error('No token provided');
        }

        console.log('✅ Auth success - Token received:', token.substring(0, 20) + '...');

        // Use API URL from environment or construct from backend
        const apiUrl = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/api`;

        // Fetch user info từ backend
        const response = await fetch(
          `${apiUrl}/auth/me`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();

        // Save token and user
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Update auth context
        login({ success: true, token, user: data.user });

        console.log('✅ User info fetched successfully');

        // Redirect to dashboard
        navigate('/');
      } catch (error) {
        console.error('❌ Auth success error:', error);
        navigate('/login?error=auth_failed');
      }
    };

    handleAuthSuccess();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}

export default AuthSuccess;
