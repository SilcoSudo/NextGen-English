// Frontend API Configuration
const config = {
  // Production API URL
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.nextgenenglish.id.vn/api'
    : `${window.location.origin}/api`,
    
  // WebSocket URL (if needed)
  WS_URL: process.env.NODE_ENV === 'production'
    ? 'wss://api.nextgenenglish.id.vn'
    : `ws://${window.location.hostname}:5000`,
    
  // Frontend URL
  FRONTEND_URL: process.env.NODE_ENV === 'production'
    ? 'https://nextgenenglish.id.vn'
    : 'http://localhost:3000'
};

export default config;