import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      console.log('🔐 Attempting login with:', { email: userData.email });
      
      const response = await fetch(`${window.location.origin}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        })
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok && data.success) {
        // Đăng nhập thành công
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setIsAuthenticated(true);
        setUser(data.user);
        console.log('✅ Login successful:', data.user);
        return { success: true, user: data.user };
      } else {
        // Đăng nhập thất bại
        console.log('❌ Login failed:', data);
        return { 
          success: false, 
          error: data.message || data.error || 'Đăng nhập thất bại' 
        };
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      return { 
        success: false, 
        error: 'Không thể kết nối đến server' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${window.location.origin}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: userData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Đăng ký thành công - tự động đăng nhập
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        // Đăng ký thất bại
        return { 
          success: false, 
          error: data.message || data.error || 'Đăng ký thất bại' 
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: 'Không thể kết nối đến server' 
      };
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    updateUser,
    logout
  };

  // Debug: Log user info khi component mount
  useEffect(() => {
    if (user) {
      console.log('Current user:', user);
      console.log('User role:', user.role);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 