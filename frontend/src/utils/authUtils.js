// Helper function để kiểm tra và validate JWT token
export const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  console.log('🔑 Getting auth token:', token ? 'Present' : 'Missing');
  
  if (!token) {
    console.warn('❌ No auth token found in localStorage');
    return null;
  }

  try {
    // Decode JWT payload (không verify signature vì không có secret key)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    console.log('🕐 Token payload:', payload);
    console.log('⏰ Current time:', currentTime);
    console.log('⏰ Token expires at:', payload.exp);
    
    if (payload.exp && payload.exp < currentTime) {
      console.warn('⚠️ Token has expired');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return null;
    }
    
    console.log('✅ Token is valid');
    return token;
  } catch (error) {
    console.error('❌ Error parsing token:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return null;
  }
};

// Helper function để tạo authenticated headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function để tạo authenticated fetch request
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
  
  const defaultHeaders = {
    'Authorization': `Bearer ${token}`
  };
  
  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers
  };
  
  console.log('🌐 Making authenticated request to:', url);
  console.log('📋 With headers:', headers);
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  console.log('📡 Response status:', response.status);
  
  // Handle unauthorized responses
  if (response.status === 401) {
    console.warn('🚫 Unauthorized - removing token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
  
  return response;
};