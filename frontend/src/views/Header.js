import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../models/AuthContext";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/videos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen) {
        const dropdown = document.querySelector('[data-dropdown="profile"]');
        if (dropdown && !dropdown.contains(event.target)) {
          setIsProfileDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);
  
  // Ẩn header khi ở trang admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500 mr-1 sm:mr-2">
              <i className="ri-graduation-cap-line"></i>
            </div>
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              <span className="hidden sm:inline">NextGenEnglish</span>
              <span className="sm:hidden">NextGen</span>
            </h1>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <i className={`text-lg sm:text-xl ${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
            <Link
              to="/home"
              className={`font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer transition-colors ${location.pathname === "/home" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
            >
              Trang chủ
            </Link>
            <Link
              to="/videos"
              className={`font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer transition-colors ${location.pathname.startsWith("/videos") ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
            >
              <span className="hidden lg:inline">Video học tập</span>
              <span className="lg:hidden">Video</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/my-videos"
                  className={`font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer transition-colors ${location.pathname === "/my-videos" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
                >
                  <span className="hidden lg:inline">Video đã mua</span>
                  <span className="lg:hidden">Đã mua</span>
                </Link>
                <Link
                  to="/payment"
                  className={`font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer transition-colors ${location.pathname === "/payment" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
                >
                  Thanh toán
                </Link>
              </>
            )}
            
            {/* Menu cho Admin */}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className={`font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer transition-colors ${location.pathname === "/admin" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
                >
                  <span className="hidden xl:inline">Quản lý hệ thống</span>
                  <span className="xl:hidden">Admin</span>
                </Link>
                <Link
                  to="/admin/videos"
                  className={`font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer transition-colors ${location.pathname === "/admin/videos" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
                >
                  <span className="hidden xl:inline">Quản lý video</span>
                  <span className="xl:hidden">QL Video</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={`font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer transition-colors ${location.pathname === "/admin/users" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
                >
                  <span className="hidden xl:inline">Quản lý người dùng</span>
                  <span className="xl:hidden">QL Users</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop Search & User Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm video..."
                className="border border-gray-300 rounded-full py-1.5 md:py-2 px-3 md:px-4 pr-8 md:pr-10 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 w-24 md:w-32 lg:w-48 xl:w-64 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2 md:right-3 top-1.5 md:top-2 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"
              >
                <i className="ri-search-line text-xs md:text-sm"></i>
              </button>
            </form>
            
            {isAuthenticated ? (
              <div className="relative" data-dropdown="profile">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-1 md:space-x-2 bg-white hover:bg-gray-100 py-1.5 px-2 md:px-3 rounded-full text-xs md:text-sm font-medium transition duration-300 border border-gray-200 cursor-pointer"
                >
                  <img
                    src={user?.avatar || "https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20young%20student%20with%20headphones%2C%20simple%20background%2C%20friendly%20smile%2C%20digital%20art%20style&width=36&height=36&seq=avatar1&orientation=squarish"}
                    alt="User Avatar"
                    className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-blue-400 object-cover"
                  />
                  <div className="hidden lg:flex flex-col">
                    <span className="text-gray-800 font-semibold text-xs">{user?.name || 'User'}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user?.role === 'admin' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user?.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <i className={`ri-arrow-down-s-line text-gray-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
                
                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <i className="ri-user-line text-blue-500"></i>
                      <span>Thông tin người dùng</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <i className="ri-logout-box-line text-red-500"></i>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 md:space-x-2 bg-blue-500 hover:bg-blue-600 py-1.5 md:py-2 px-2 md:px-3 lg:px-4 rounded-full text-xs md:text-sm font-medium transition duration-300 text-white cursor-pointer min-h-[36px]"
              >
                <i className="ri-login-box-line text-sm"></i>
                <span className="hidden md:inline">Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm video..."
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-3 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"
                >
                  <i className="ri-search-line"></i>
                </button>
              </form>

              {/* Mobile Navigation Links */}
              <Link
                to="/home"
                className={`px-4 py-3 rounded-lg font-medium text-sm ${location.pathname === "/home" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="ri-home-line mr-3"></i>
                Trang chủ
              </Link>
              <Link
                to="/videos"
                className={`px-4 py-3 rounded-lg font-medium text-sm ${location.pathname.startsWith("/videos") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="ri-video-line mr-3"></i>
                Video học tập
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/my-videos"
                    className={`px-4 py-3 rounded-lg font-medium text-sm ${location.pathname === "/my-videos" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-play-circle-line mr-3"></i>
                    Video đã mua
                  </Link>
                  <Link
                    to="/payment"
                    className={`px-4 py-3 rounded-lg font-medium text-sm ${location.pathname === "/payment" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-bank-card-line mr-3"></i>
                    Thanh toán
                  </Link>
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="px-4 py-3 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-dashboard-line mr-3"></i>
                    {user?.role === 'admin' ? 'Quản lý hệ thống' : 'Dashboard'}
                  </Link>
                </>
              )}

              {/* Admin Menu Items */}
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/videos"
                    className={`px-4 py-3 rounded-lg font-medium text-sm ${location.pathname === "/admin/videos" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-video-line mr-3"></i>
                    Quản lý video
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-4 py-3 rounded-lg font-medium text-sm ${location.pathname === "/admin/users" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-user-line mr-3"></i>
                    Quản lý người dùng
                  </Link>
                </>
              )}

              {/* Mobile User Info & Actions */}
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg mb-3">
                    <img
                      src={user?.avatar || "https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20young%20student%20with%20headphones%2C%20simple%20background%2C%20friendly%20smile%2C%20digital%20art%20style&width=36&height=36&seq=avatar1&orientation=squarish"}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full border-2 border-blue-400 object-cover mr-3"
                    />
                    <div>
                      <div className="text-gray-800 font-semibold text-sm">{user?.name || 'User'}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                        user?.role === 'admin' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user?.role === 'admin' ? 'Admin' : 'User'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile User Actions */}
                  <div className="space-y-2">
                    <Link
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      className="w-full flex items-center space-x-3 px-4 py-3 bg-white hover:bg-blue-50 rounded-lg text-sm font-medium transition duration-300 text-gray-700 hover:text-blue-600 border border-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="ri-user-line text-blue-500"></i>
                      <span>Thông tin người dùng</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 bg-white hover:bg-red-50 rounded-lg text-sm font-medium transition duration-300 text-gray-700 hover:text-red-600 border border-gray-200"
                    >
                      <i className="ri-logout-box-line text-red-500"></i>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 py-3 px-4 rounded-lg text-sm font-medium transition duration-300 text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="ri-login-box-line"></i>
                    <span>Đăng nhập</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
