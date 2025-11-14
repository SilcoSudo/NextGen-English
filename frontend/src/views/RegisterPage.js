// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../models/AuthContext';
import { useGoogleLogin as useGoogleLoginHook } from '../models/useGoogleLogin';

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    receiveUpdates: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { handleGoogleLogin, handleGoogleError } = useGoogleLoginHook();
  const navigate = useNavigate();
  const { register } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'Rất yếu', color: 'text-red-500', bg: 'bg-red-500' };
      case 2: return { text: 'Yếu', color: 'text-orange-500', bg: 'bg-orange-500' };
      case 3: return { text: 'Trung bình', color: 'text-yellow-500', bg: 'bg-yellow-500' };
      case 4: return { text: 'Mạnh', color: 'text-blue-500', bg: 'bg-blue-500' };
      case 5: return { text: 'Rất mạnh', color: 'text-green-500', bg: 'bg-green-500' };
      default: return { text: '', color: '', bg: '' };
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Vui lòng nhập họ tên';
    if (!formData.username.trim()) return 'Vui lòng nhập tên đăng nhập';
    if (formData.username.length < 3) return 'Tên đăng nhập phải có ít nhất 3 ký tự';
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) return 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Vui lòng nhập email hợp lệ';
    if (formData.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    if (formData.password !== formData.confirmPassword) return 'Mật khẩu xác nhận không khớp';
    if (!formData.agreeToTerms) return 'Vui lòng đồng ý với điều khoản sử dụng';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Call register API
      const registerResult = await register({
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (registerResult.success) {
        // Show success message and redirect
        alert('🎉 Đăng ký thành công! Chào mừng bạn đến với NextGen English!');
        navigate('/');
      } else {
        setError(registerResult.error || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const strengthIndicator = getPasswordStrengthText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 font-sans relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-cyan-400 to-green-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.7s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '1.1s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full">
          {/* Back to Home Link */}
          <div className="mb-8">
            <Link 
              to="/home"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              <span className="text-sm font-medium">Quay lại trang chủ</span>
            </Link>
          </div>

          {/* Modern Register Form Container */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none"></div>
            
            {/* Header with enhanced design */}
            <div className="px-8 pt-8 pb-6 text-center relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 transition-transform duration-300 hover:rotate-0">
                    <i className="ri-user-add-line text-2xl text-white"></i>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
                    NextGen
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">English Learning</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Tham gia cùng chúng tôi! 🚀</h2>
              <p className="text-gray-600 text-lg">Bắt đầu hành trình học tiếng Anh của bạn</p>
            </div>

            {/* Enhanced Register Form */}
            <div className="px-8 pb-8 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Field */}
                <div className="group">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-green-600 transition-colors">
                    <i className="ri-user-line mr-2"></i>
                    Họ và tên
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 pl-14 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      placeholder="Nhập họ và tên của bạn"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                      <i className="ri-user-3-line text-lg"></i>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                    <i className="ri-mail-line mr-2"></i>
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 pl-14 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      placeholder="example@gmail.com"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <i className="ri-at-line text-lg"></i>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-purple-600 transition-colors">
                    <i className="ri-lock-line mr-2"></i>
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 pl-14 pr-14 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      placeholder="Tạo mật khẩu mạnh"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                      <i className="ri-shield-keyhole-line text-lg"></i>
                    </div>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors duration-200 cursor-pointer p-1 rounded-lg hover:bg-purple-50"
                    >
                      <i className={`ri-${showPassword ? 'eye-off-line' : 'eye-line'} text-lg`}></i>
                    </button>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Độ mạnh mật khẩu:</span>
                        <span className={`text-xs font-medium ${strengthIndicator.color}`}>
                          {strengthIndicator.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${strengthIndicator.bg} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-pink-600 transition-colors">
                    <i className="ri-lock-2-line mr-2"></i>
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 pl-14 pr-14 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      placeholder="Nhập lại mật khẩu"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                      <i className="ri-shield-check-line text-lg"></i>
                    </div>
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors duration-200 cursor-pointer p-1 rounded-lg hover:bg-pink-50"
                    >
                      <i className={`ri-${showConfirmPassword ? 'eye-off-line' : 'eye-line'} text-lg`}></i>
                    </button>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-pink-500 to-red-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-2 flex items-center">
                      {formData.password === formData.confirmPassword ? (
                        <div className="flex items-center text-green-600">
                          <i className="ri-check-line mr-1"></i>
                          <span className="text-xs">Mật khẩu khớp</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <i className="ri-close-line mr-1"></i>
                          <span className="text-xs">Mật khẩu không khớp</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Username */}
                <div className="group">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-teal-600 transition-colors">
                    <i className="ri-user-line mr-2"></i>
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 pl-14 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      placeholder="vd: nguyen_van_a"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                      <i className="ri-at-line text-lg"></i>
                    </div>
                  </div>
                </div>

                {/* Terms and Updates Checkboxes */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start group cursor-pointer">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:ring-2 cursor-pointer transition-all duration-200 hover:border-green-400"
                        required
                      />
                    </div>
                    <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700 cursor-pointer group-hover:text-green-600 transition-colors">
                      Tôi đồng ý với{' '}
                      <a href="#" className="text-green-600 hover:text-green-800 font-medium underline">
                        Điều khoản sử dụng
                      </a>{' '}
                      và{' '}
                      <a href="#" className="text-green-600 hover:text-green-800 font-medium underline">
                        Chính sách bảo mật
                      </a>
                    </label>
                  </div>

                  <div className="flex items-start group cursor-pointer">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        id="receiveUpdates"
                        name="receiveUpdates"
                        checked={formData.receiveUpdates}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all duration-200 hover:border-blue-400"
                      />
                    </div>
                    <label htmlFor="receiveUpdates" className="ml-3 text-sm text-gray-700 cursor-pointer group-hover:text-blue-600 transition-colors">
                      Nhận thông báo về khóa học mới và ưu đãi đặc biệt
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <i className="ri-error-warning-line text-red-500 mr-2"></i>
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center overflow-hidden"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span className="font-medium">Đang tạo tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-user-add-line mr-3 text-xl group-hover:animate-pulse"></i>
                      <span>Tạo tài khoản ngay</span>
                      <i className="ri-arrow-right-line ml-3 text-xl group-hover:translate-x-1 transition-transform duration-300"></i>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">hoặc đăng ký với</span>
                  </div>
                </div>

                {/* Google Register Button */}
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={handleGoogleError}
                    width="100%"
                    locale="vi_VN"
                  />
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 cursor-pointer">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-2xl opacity-50 -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-gift-line text-white text-sm"></i>
                </div>
                <h4 className="text-base font-bold text-gray-800">Đăng ký ngay để nhận</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                <div className="flex items-start">
                  <i className="ri-medal-line text-yellow-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  <span><strong>7 ngày</strong> học thử miễn phí</span>
                </div>
                <div className="flex items-start">
                  <i className="ri-book-open-line text-blue-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  <span><strong>Truy cập</strong> tất cả khóa học cơ bản</span>
                </div>
                <div className="flex items-start">
                  <i className="ri-customer-service-2-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  <span><strong>Hỗ trợ</strong> 24/7 từ đội ngũ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Support Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 p-4 rounded-2xl shadow-2xl text-white transition-all duration-300 transform hover:scale-110 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <i className="ri-question-answer-line text-xl relative z-10"></i>
          </button>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
              Cần hỗ trợ đăng ký? Chat với chúng tôi!
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;