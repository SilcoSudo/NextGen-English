import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../models/AuthContext';

function AdminRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Chỉ chuyển hướng nếu đã đăng nhập và đang ở dashboard
    if (isAuthenticated && user?.role === 'admin' && location.pathname === '/dashboard') {
      console.log('Admin detected on dashboard, redirecting to /admin');
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  // Không render gì, chỉ xử lý chuyển hướng
  return null;
}

export default AdminRedirect; 