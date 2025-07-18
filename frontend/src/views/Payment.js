import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mockCourses from "./mockCourses";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    email: "",
    phone: "",
    paymentMethod: "banking"
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lấy thông tin khóa học từ URL params hoặc state
  const courseId = new URLSearchParams(location.search).get('courseId') || 2;
  const course = mockCourses.find(c => c.id === Number(courseId)) || mockCourses[1];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Mock API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/my-courses');
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-3xl text-green-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-6">Cảm ơn bạn đã đăng ký khóa học. Chúng tôi sẽ gửi email xác nhận trong giây lát.</p>
          <div className="animate-pulse">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Đang chuyển hướng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký khóa học</h1>
          <p className="text-gray-600">Hoàn tất thông tin để bắt đầu hành trình học tập</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Thông tin khóa học */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="ri-book-open-line text-blue-500 mr-2"></i>
              Thông tin khóa học
            </h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
              <div className="flex items-start space-x-4">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <img src={course.teacherAvatar} className="w-6 h-6 rounded-full mr-2" alt="Teacher" />
                    <span>{course.teacherName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Độ tuổi:</span>
                <span className="font-medium">{course.age}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Trình độ:</span>
                <span className="font-medium">{course.level}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium">{course.weeks} tuần</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Số bài học:</span>
                <span className="font-medium">{course.lessons} bài</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3">
                <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                <span className="text-2xl font-bold text-blue-600">{course.price}</span>
              </div>
            </div>
          </div>

          {/* Form đăng ký */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="ri-user-line text-green-500 mr-2"></i>
              Thông tin đăng ký
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên phụ huynh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập tên phụ huynh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên học sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập tên học sinh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="banking"
                      checked={formData.paymentMethod === "banking"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <i className="ri-bank-card-line text-blue-500 mr-2"></i>
                      <span>Chuyển khoản ngân hàng</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      checked={formData.paymentMethod === "momo"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <i className="ri-wallet-line text-pink-500 mr-2"></i>
                      <span>Ví MoMo</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="zalopay"
                      checked={formData.paymentMethod === "zalopay"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <i className="ri-wallet-line text-blue-500 mr-2"></i>
                      <span>ZaloPay</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="ri-lock-line mr-2"></i>
                    Thanh toán an toàn - {course.price}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <i className="ri-shield-check-line text-yellow-600 mt-1 mr-2"></i>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Bảo mật thông tin</p>
                  <p>Thông tin của bạn được mã hóa và bảo vệ an toàn. Chúng tôi cam kết không chia sẻ thông tin cá nhân.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nút quay lại */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment; 