import React, { useState } from 'react';

const TeacherHelp = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const helpSections = {
    'getting-started': {
      title: '🚀 Bắt đầu',
      icon: '🚀',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Chào mừng bạn đến với NextGen English!</h3>
            <p className="text-gray-700 mb-4">
              Là một giáo viên trên nền tảng của chúng tôi, bạn có thể tạo và quản lý các khóa học tiếng Anh một cách dễ dàng.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">📋 Các bước đầu tiên:</h4>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Hoàn thiện thông tin cá nhân trong phần Cài đặt</li>
                <li>Tạo bài học đầu tiên của bạn</li>
                <li>Upload video bài giảng</li>
                <li>Xuất bản khóa học</li>
                <li>Theo dõi hiệu suất qua Analytics</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">✅ Lợi ích khi là Teacher</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Thu nhập từ các khóa học</li>
                  <li>• Tiếp cận hàng nghìn học viên</li>
                  <li>• Công cụ quản lý chuyên nghiệp</li>
                  <li>• Hỗ trợ 24/7</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">📊 Theo dõi hiệu suất</h4>
                <p className="text-sm text-purple-800">
                  Sử dụng tab Analytics để xem doanh thu, lượt xem, và phản hồi từ học viên một cách chi tiết.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'create-course': {
      title: '📚 Tạo khóa học',
      icon: '📚',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Hướng dẫn tạo khóa học</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">📝 Thông tin cơ bản</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Tiêu đề:</strong> Ngắn gọn, thu hút (tối đa 100 ký tự)</li>
                <li>• <strong>Mô tả:</strong> Chi tiết về nội dung khóa học</li>
                <li>• <strong>Cấp độ:</strong> Beginner, Intermediate, Advanced</li>
                <li>• <strong>Thời lượng:</strong> Ước tính thời gian hoàn thành</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">🎥 Upload Video</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Định dạng: MP4, MOV, AVI (tối đa 500MB)</li>
                <li>• Chất lượng: 720p trở lên khuyến nghị</li>
                <li>• Âm thanh: Rõ ràng, không nhiễu</li>
                <li>• Thời lượng: 5-30 phút mỗi video</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">✨ Tips tạo khóa học thành công</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Chuẩn bị kịch bản trước khi quay</li>
                <li>• Sử dụng ví dụ thực tế</li>
                <li>• Chia nhỏ nội dung thành các phần logic</li>
                <li>• Thêm bài tập và câu hỏi</li>
                <li>• Preview trước khi xuất bản</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'video-upload': {
      title: '🎥 Upload Video',
      icon: '🎥',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Hướng dẫn Upload Video</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-900 mb-2">⚠️ Yêu cầu kỹ thuật</h4>
              <div className="text-sm text-red-800 space-y-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Định dạng hỗ trợ:</strong></p>
                    <ul className="list-disc list-inside">
                      <li>MP4 (khuyến nghị)</li>
                      <li>MOV</li>
                      <li>AVI</li>
                      <li>MKV</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Giới hạn:</strong></p>
                    <ul className="list-disc list-inside">
                      <li>Kích thước: 500MB</li>
                      <li>Độ phân giải: 720p+</li>
                      <li>Thời lượng: 5-30 phút</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-medium text-indigo-900 mb-2">📋 Quy trình Upload</h4>
              <ol className="list-decimal list-inside text-sm text-indigo-800 space-y-1">
                <li>Vào tab "Video Library" trong Dashboard</li>
                <li>Click nút "Upload Video" hoặc kéo thả file</li>
                <li>Đợi quá trình upload hoàn tất</li>
                <li>Thêm tiêu đề và mô tả cho video</li>
                <li>Chọn khóa học để gắn video</li>
                <li>Lưu thay đổi</li>
              </ol>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-2">🎬 Mẹo quay video chuyên nghiệp</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Ánh sáng: Quay ở nơi có ánh sáng tự nhiên</li>
                <li>• Âm thanh: Sử dụng micro rời nếu có thể</li>
                <li>• Góc quay: Đặt camera ngang tầm mắt</li>
                <li>• Background: Chọn phông nền đơn giản, không xao nhãng</li>
                <li>• Trang phục: Mặc trang phục chuyên nghiệp</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'analytics': {
      title: '📊 Analytics',
      icon: '📊',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Hiểu về Analytics</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">📈 Các chỉ số quan trọng</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-800">
                <div className="space-y-2">
                  <p><strong>👁️ Lượt xem:</strong> Số lần video được xem</p>
                  <p><strong>💰 Doanh thu:</strong> Thu nhập từ các khóa học</p>
                  <p><strong>👥 Học viên:</strong> Số lượng học viên đăng ký</p>
                  <p><strong>⭐ Đánh giá:</strong> Điểm trung bình từ học viên</p>
                </div>
                <div className="space-y-2">
                  <p><strong>📊 Tỷ lệ hoàn thành:</strong> % học viên hoàn thành khóa học</p>
                  <p><strong>🎯 Chuyển đổi:</strong> Tỷ lệ từ xem thử đến mua</p>
                  <p><strong>⏰ Thời gian xem:</strong> Thời gian trung bình mỗi session</p>
                  <p><strong>🔄 Tương tác:</strong> Comments, likes, shares</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">📅 Theo dõi định kỳ</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• <strong>Hàng ngày:</strong> Kiểm tra lượt xem và doanh thu</li>
                <li>• <strong>Hàng tuần:</strong> Phân tích xu hướng và hiệu suất</li>
                <li>• <strong>Hàng tháng:</strong> Đánh giá tổng thể và lập kế hoạch</li>
                <li>• <strong>So sánh:</strong> So sánh các khóa học với nhau</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">🎯 Cải thiện hiệu suất</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Phân tích video có lượt xem cao nhất</li>
                <li>• Cải thiện nội dung dựa trên feedback</li>
                <li>• Tối ưu thời lượng video phù hợp</li>
                <li>• Tương tác với học viên thường xuyên</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'revenue': {
      title: '💰 Doanh thu',
      icon: '💰',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Quản lý Doanh thu</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-medium text-emerald-900 mb-2">💵 Cơ chế chia sẻ doanh thu</h4>
              <div className="text-sm text-emerald-800">
                <p className="mb-2">NextGen English chia sẻ doanh thu theo mô hình:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Teacher nhận: <strong>70%</strong> doanh thu khóa học</li>
                  <li>Platform fee: <strong>30%</strong> (bao gồm hosting, marketing, support)</li>
                  <li>Thanh toán: Hàng tháng vào ngày 15</li>
                  <li>Minimum payout: 500,000 VNĐ</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">🏦 Phương thức thanh toán</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Chuyển khoản ngân hàng:</strong> Nhanh, an toàn</li>
                <li>• <strong>Ví điện tử:</strong> MoMo, ZaloPay, ViettelPay</li>
                <li>• <strong>PayPal:</strong> Cho thanh toán quốc tế</li>
                <li>• <strong>Cryptocurrency:</strong> Bitcoin, USDT (tuỳ chọn)</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">📋 Yêu cầu thuế và pháp lý</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Cung cấp thông tin thuế (Mã số thuế cá nhân)</li>
                <li>• Kê khai thu nhập theo quy định</li>
                <li>• Lưu trữ hóa đơn, chứng từ</li>
                <li>• NextGen sẽ hỗ trợ cung cấp báo cáo doanh thu</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">📊 Tối ưu doanh thu</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Tạo nhiều khóa học đa dạng</li>
                <li>• Tương tác với học viên để có review tốt</li>
                <li>• Tham gia các chương trình khuyến mãi</li>
                <li>• Cập nhật nội dung thường xuyên</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'support': {
      title: '🆘 Hỗ trợ',
      icon: '🆘',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Hỗ trợ Teacher</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-medium text-indigo-900 mb-2">📞 Liên hệ hỗ trợ</h4>
              <div className="text-sm text-indigo-800 space-y-2">
                <p><strong>📧 Email:</strong> teacher-support@nextgen-english.com</p>
                <p><strong>📱 Hotline:</strong> 1900-123-456 (24/7)</p>
                <p><strong>💬 Live Chat:</strong> Góc dưới phải màn hình</p>
                <p><strong>📲 Zalo:</strong> 0901-234-567</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">❓ FAQ - Câu hỏi thường gặp</h4>
              <div className="text-sm text-green-800 space-y-2">
                <details className="cursor-pointer">
                  <summary className="font-medium">Làm thế nào để video được duyệt nhanh?</summary>
                  <p className="mt-1 pl-4">Video sẽ được duyệt trong 24-48h. Đảm bảo nội dung chất lượng, không vi phạm bản quyền.</p>
                </details>
                <details className="cursor-pointer">
                  <summary className="font-medium">Tôi có thể thay đổi giá khóa học không?</summary>
                  <p className="mt-1 pl-4">Có, bạn có thể điều chỉnh giá bất kỳ lúc nào. Giá mới chỉ áp dụng cho học viên mới đăng ký.</p>
                </details>
                <details className="cursor-pointer">
                  <summary className="font-medium">Khi nào tôi nhận được tiền?</summary>
                  <p className="mt-1 pl-4">Thanh toán hàng tháng vào ngày 15, với số tiền tối thiểu 500,000 VNĐ.</p>
                </details>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-2">🎓 Tài liệu hướng dẫn</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• <a href="#" className="text-blue-600 hover:underline">Hướng dẫn tạo khóa học hiệu quả</a></li>
                <li>• <a href="#" className="text-blue-600 hover:underline">Mẹo tăng tương tác với học viên</a></li>
                <li>• <a href="#" className="text-blue-600 hover:underline">Chiến lược marketing khóa học</a></li>
                <li>• <a href="#" className="text-blue-600 hover:underline">Công cụ chỉnh sửa video miễn phí</a></li>
              </ul>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-900 mb-2">🚨 Báo cáo sự cố</h4>
              <p className="text-sm text-red-800 mb-2">
                Nếu gặp sự cố kỹ thuật, vui lòng cung cấp:
              </p>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Mô tả chi tiết sự cố</li>
                <li>• Screenshot/Video lỗi (nếu có)</li>
                <li>• Trình duyệt và phiên bản đang sử dụng</li>
                <li>• Thời gian xảy ra sự cố</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  };

  const filteredSections = Object.entries(helpSections).filter(([key, section]) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">🆘 Trung tâm hỗ trợ Teacher</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm hướng dẫn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
          </div>
        </div>

        <div className="flex max-h-[70vh]">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {filteredSections.map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3
                    ${activeSection === key 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {helpSections[activeSection]?.content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center text-sm text-gray-600">
            <p>
              Cần hỗ trợ thêm? 
              <a href="mailto:teacher-support@nextgen-english.com" className="text-blue-600 hover:underline ml-1">
                Liên hệ với chúng tôi
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHelp;