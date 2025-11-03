// Frontend API Configuration
const config = {
  // Production API URL - Use environment variable or fallback
  API_BASE_URL: process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://api.nextgenenglish.id.vn/api'
      : 'http://localhost:5000/api'),
    
  // WebSocket URL (if needed)
  WS_URL: process.env.NODE_ENV === 'production'
    ? 'wss://api.nextgenenglish.id.vn'
    : `ws://localhost:5000`,
    
  // Frontend URL
  FRONTEND_URL: process.env.NODE_ENV === 'production'
    ? 'https://nextgenenglish.id.vn'
    : 'http://localhost:3000',

  // Timeout for API requests (30 seconds)
  API_TIMEOUT: 30000,

  // Retry config
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};

export default config;