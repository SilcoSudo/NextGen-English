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

  const login = (userData) => {
    // Mock login với 2 tài khoản mẫu có mật khẩu
    const mockUsers = {
      'admin': {
        id: 1,
        name: 'Admin',
        username: 'admin',
        email: 'admin@nextgen.com',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://readdy.ai/api/search-image?query=professional%20admin%20avatar%20cartoon%20style%20business%20person%20with%20tie%2C%20friendly%20smile%2C%20digital%20art&width=36&height=36&seq=admin&orientation=squarish'
      },
      'user': {
        id: 2,
        name: 'Emma',
        username: 'emma',
        email: 'user@nextgen.com',
        password: 'user123',
        role: 'user',
        avatar: 'https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20young%20student%20with%20headphones%2C%20simple%20background%2C%20friendly%20smile%2C%20digital%20art%20style&width=36&height=36&seq=user&orientation=squarish'
      }
    };

    // Kiểm tra tài khoản mẫu - hỗ trợ cả username và email
    const userInfo = mockUsers[userData.email] || mockUsers[userData.username];
    
    if (userInfo && userData.password === userInfo.password) {
      // Đăng nhập thành công với tài khoản mẫu
      const mockToken = 'mock-jwt-token-' + Date.now();
      const { password, ...userWithoutPassword } = userInfo; // Loại bỏ password khỏi user object
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      setIsAuthenticated(true);
      setUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    } else if (userInfo && userData.password !== userInfo.password) {
      // Sai mật khẩu
      return { success: false, error: 'Mật khẩu không đúng' };
    } else {
      // Tài khoản mới - mặc định là user (cho phép đăng nhập với bất kỳ mật khẩu)
      const mockToken = 'mock-jwt-token-' + Date.now();
      const newUserInfo = {
        id: Date.now(),
        name: userData.email?.split('@')[0] || userData.username || 'User',
        username: userData.username || userData.email?.split('@')[0] || 'user',
        email: userData.email || `${userData.username}@nextgen.com`,
        role: 'user',
        avatar: 'https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20young%20student%20with%20headphones%2C%20simple%20background%2C%20friendly%20smile%2C%20digital%20art%20style&width=36&height=36&seq=newuser&orientation=squarish'
      };

      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(newUserInfo));
      
      setIsAuthenticated(true);
      setUser(newUserInfo);
      return { success: true, user: newUserInfo };
    }
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