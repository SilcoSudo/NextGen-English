import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../models/AuthContext";

function Header() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  // Ẩn header khi ở trang admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-3xl font-bold text-blue-500 mr-2">
            <i className="ri-graduation-cap-line"></i>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            NextGenEnglish
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/home"
            className={`font-medium text-sm whitespace-nowrap cursor-pointer ${location.pathname === "/home" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
          >
            Trang chủ
          </Link>
          <Link
            to="/courses"
            className={`font-medium text-sm whitespace-nowrap cursor-pointer ${location.pathname.startsWith("/courses") ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
          >
            Khám phá khóa học
          </Link>
          
            <>
              <Link
                to="/my-courses"
                className={`font-medium text-sm whitespace-nowrap cursor-pointer ${location.pathname === "/my-courses" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
              >
                Khóa học đã mua
              </Link>
              <Link
                to="/payment"
                className={`font-medium text-sm whitespace-nowrap cursor-pointer ${location.pathname === "/payment" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
              >
                Thanh toán
              </Link>
            </>
          
          
          {/* Menu cho Admin */}
          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link
                to="/admin"
                className={`font-medium text-sm whitespace-nowrap cursor-pointer ${location.pathname === "/admin" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
              >
                Quản lý hệ thống
              </Link>
              <Link
                to="/admin/courses"
                className={`font-medium text-sm whitespace-nowrap cursor-pointer ${location.pathname === "/admin/courses" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
              >
                Quản lý khóa học
              </Link>
              <Link
                to="/admin/users"
                className={`font-medium text-sm whitespace-nowrap cursor-pointer ${location.pathname === "/admin/users" ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}
              >
                Quản lý người dùng
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-40 md:w-64"
            />
            <button className="absolute right-3 top-2 text-gray-400 cursor-pointer">
              <i className="ri-search-line"></i>
            </button>
          </div>
          
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className="flex items-center space-x-2 bg-white hover:bg-gray-100 py-1.5 px-3 rounded-full text-sm font-medium transition duration-300 border border-gray-200 cursor-pointer"
              >
                <img
                  src={user?.avatar || "https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20young%20student%20with%20headphones%2C%20simple%20background%2C%20friendly%20smile%2C%20digital%20art%20style&width=36&height=36&seq=avatar1&orientation=squarish"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-blue-400 object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-gray-800 font-semibold text-xs">{user?.name || 'User'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user?.role === 'admin' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user?.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 py-2 px-4 rounded-full text-sm font-medium transition duration-300 text-white cursor-pointer"
              >
                <i className="ri-logout-box-line"></i>
                <span>Đăng xuất</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-full text-sm font-medium transition duration-300 text-white cursor-pointer"
            >
              <i className="ri-login-box-line"></i>
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
