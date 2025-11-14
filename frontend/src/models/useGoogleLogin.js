import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleGoogleLogin = useCallback(async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      console.log('🔐 Google credential received');

      // Send token to backend
      const response = await fetch(
        `${window.location.origin}/api/auth/google/callback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: credential })
        }
      );

      if (!response.ok) {
        throw new Error('Google login failed');
      }

      const data = await response.json();

      if (data.success) {
        // Save token and user
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Update auth context
        authLogin({ success: true, token: data.token, user: data.user });

        console.log('✅ Google login successful');

        // Redirect to dashboard
        navigate('/');
      } else {
        throw new Error(data.error || 'Google login failed');
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      alert('Đăng nhập Google thất bại: ' + error.message);
    }
  }, [navigate, authLogin]);

  const handleGoogleError = useCallback(() => {
    console.error('❌ Google login failed');
    alert('Đăng nhập Google thất bại');
  }, []);

  return {
    handleGoogleLogin,
    handleGoogleError
  };
};
