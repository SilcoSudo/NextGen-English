import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy thông tin bài học từ URL params hoặc state
  const lessonId = new URLSearchParams(location.search).get('lessonId');
  const courseId = new URLSearchParams(location.search).get('courseId'); // Legacy support
  const actualLessonId = lessonId || courseId; // Use lessonId first, fallback to courseId

  useEffect(() => {
    const fetchLesson = async () => {
      if (!actualLessonId) {
        setError('Không tìm thấy bài học');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${window.location.origin}/api/lessons/${actualLessonId}`);
        const data = await response.json();
        
        if (data.success) {
          setLesson(data.data.lesson || data.data);
        } else {
          setError('Không thể tải thông tin bài học');
        }
      } catch (err) {
        console.error('Fetch lesson error:', err);
        setError('Lỗi kết nối');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [actualLessonId]);

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
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Kiểm tra lesson có miễn phí không
      if (lesson.price === 0) {
        // Xử lý đăng ký miễn phí
        const response = await fetch(`${window.location.origin}/api/lessons/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            lessonId: actualLessonId,
            paymentInfo: formData
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setIsProcessing(false);
          setIsSuccess(true);
          setTimeout(() => {
            navigate('/my-lessons');
          }, 2000);
        } else {
          throw new Error(data.message || 'Đăng ký khóa học thất bại');
        }
      } else {
        // Xử lý thanh toán có phí với MoMo
        const response = await fetch(`${window.location.origin}/api/payment/momo/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            lessonId: actualLessonId
          })
        });

        const data = await response.json();
        
        if (data.success) {
          // Redirect đến trang thanh toán MoMo
          window.location.href = data.data.payUrl;
        } else {
          throw new Error(data.message || 'Tạo thanh toán thất bại');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setIsProcessing(false);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-300 rounded mb-4 w-48 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-600 font-medium text-lg mb-4">{error || 'Không tìm thấy khóa học!'}</div>
          <button 
            onClick={() => navigate('/lessons')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6 md:py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Đăng ký khóa học</h1>
          <p className="text-gray-600 text-sm md:text-base">Hoàn tất thông tin để bắt đầu hành trình học tập</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Thông tin khóa học */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 order-2 lg:order-1">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
              <i className="ri-book-open-line text-blue-500 mr-2"></i>
              Thông tin khóa học
            </h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 md:p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <img 
                  src={lesson.thumbnail || '/api/images/default-lesson.jpg'} 
                  alt={lesson.title} 
                  className="w-full sm:w-20 h-32 sm:h-20 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = '/api/images/default-lesson.jpg';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1 text-sm md:text-base">{lesson.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-2 leading-relaxed">{lesson.description}</p>
                  <div className="flex items-center text-xs md:text-sm text-gray-500">
                    <img 
                      src={lesson.createdBy?.avatar || '/api/images/default-teacher.jpg'} 
                      className="w-5 h-5 md:w-6 md:h-6 rounded-full mr-2" 
                      alt="Teacher"
                      onError={(e) => {
                        e.target.src = '/api/images/default-teacher.jpg';
                      }}
                    />
                    <span>{lesson.createdBy?.name || 'Giáo viên'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Độ tuổi:</span>
                <span className="font-medium">{lesson.ageGroup}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Trình độ:</span>
                <span className="font-medium">{lesson.level}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Thời lượng:</span>
                <span className="font-medium">{lesson.duration} phút</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3">
                <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {lesson.price === 0 ? 
                    'Miễn phí' : 
                    `${lesson.price?.toLocaleString() || 0}đ`
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Form đăng ký */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 order-1 lg:order-2">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
              <i className="ri-user-line text-green-500 mr-2"></i>
              Thông tin đăng ký
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Tên phụ huynh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                  placeholder="Nhập tên phụ huynh"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Tên học sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
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
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-2 md:p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="banking"
                      checked={formData.paymentMethod === "banking"}
                      onChange={handleInputChange}
                      className="mr-2 md:mr-3"
                    />
                    <div className="flex items-center">
                      <i className="ri-bank-card-line text-blue-500 mr-2 text-sm md:text-base"></i>
                      <span className="text-sm md:text-base">Chuyển khoản ngân hàng</span>
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
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm md:text-base"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-lock-line mr-2"></i>
                    <span className="hidden sm:inline">Thanh toán an toàn - </span>
                    <span>
                      {lesson.price === 0 ? 
                        'Đăng ký ngay' : 
                        `${lesson.price?.toLocaleString() || 0}đ`
                      }
                    </span>
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
        <div className="text-center mt-6 md:mt-8">
          <button
            onClick={() => navigate('/lessons')}
            className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            <span className="hidden sm:inline">Quay lại danh sách khóa học</span>
            <span className="sm:hidden">Quay lại</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment; 