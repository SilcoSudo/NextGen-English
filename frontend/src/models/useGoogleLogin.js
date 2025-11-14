import { useCallback } from 'react';

/**
 * Hook to handle Google OAuth login
 * The OAuth flow is handled automatically by GoogleLogin component
 * This hook is kept for reference/custom implementations
 */
export const useGoogleLogin = () => {

  /**
   * Handle when GoogleLogin component successfully authenticates
   * The actual OAuth is handled by Google, we just store the result
   */
  const handleGoogleLoginSuccess = useCallback((credentialResponse) => {
    try {
      console.log('🔐 Google login response received');
      console.log('credential:', credentialResponse?.credential ? 'present' : 'missing');

      // NOTE: The @react-oauth/google library sends credential (ID token)
      // But the actual OAuth flow should redirect to backend OAuth endpoint
      // which we do via the GoogleLogin button's onSuccess handler
      
      if (credentialResponse?.credential) {
        // This is the ID token from Google
        const idToken = credentialResponse.credential;
        console.log('🔐 ID Token:', idToken.substring(0, 30) + '...');
      }

      // The flow should be:
      // 1. User clicks GoogleLogin button
      // 2. GoogleLogin redirects to /api/auth/google
      // 3. Backend redirects to Google OAuth
      // 4. User authenticates with Google
      // 5. Google redirects back to /api/auth/google/callback
      // 6. Backend creates JWT and redirects to auth-success page
      // 7. AuthSuccess component handles JWT extraction and stores it

    } catch (error) {
      console.error('❌ Google login error:', error);
      throw error;
    }
  }, []);

  const handleGoogleError = useCallback(() => {
    console.error('❌ Google login failed');
    alert('Đăng nhập Google thất bại');
  }, []);

  return {
    handleGoogleLoginSuccess,
    handleGoogleError
  };
};
