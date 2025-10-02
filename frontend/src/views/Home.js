import React from "react";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://readdy.ai/api/search-image?query=Colorful%20cartoon%20illustration%20of%20happy%20diverse%20children%20learning%20English%20with%20books%20and%20tablets%2C%20surrounded%20by%20floating%20English%20letters%20and%20words%2C%20bright%20cheerful%20background%20with%20blue%2C%20yellow%2C%20pink%20and%20green%20colors%2C%20fun%20educational%20setting&width=1440&height=600&seq=hero1&orientation=landscape"
            alt="Children learning English"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-32 relative z-10">
          <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-xl text-white text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
              Học Tiếng Anh Qua Video Tương Tác
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-5 sm:mb-6 md:mb-8 leading-relaxed opacity-90 max-w-lg mx-auto lg:mx-0">
              Khám phá thư viện video học tiếng Anh phong phú, từ cơ bản đến nâng cao. Mua từng video theo nhu cầu học tập!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
              <button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-blue-900 py-3 md:py-4 px-5 sm:px-6 md:px-8 rounded-full text-sm sm:text-base md:text-lg font-bold transition duration-300 cursor-pointer shadow-lg hover:shadow-xl min-h-[44px] touch-manipulation">
                Khám phá video
              </button>
              <button className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/50 py-3 md:py-4 px-5 sm:px-6 md:px-8 rounded-full text-sm sm:text-base md:text-lg font-bold transition duration-300 cursor-pointer min-h-[44px] touch-manipulation">
                Xem video miễn phí
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 leading-tight">
            Tại sao chọn <span className="text-blue-500">NextGen English</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 md:p-8 text-center transition-transform hover:scale-105 duration-300 shadow-sm hover:shadow-md">
              <div className="text-2xl sm:text-3xl md:text-4xl text-blue-500 mb-2 sm:mb-3 md:mb-4 flex justify-center">
                <i className="ri-graduation-cap-line"></i>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 md:mb-3">Phương pháp học hiệu quả</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Phương pháp giảng dạy tương tác giúp trẻ tiếp thu kiến thức nhanh chóng và hiệu quả.
              </p>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 sm:p-6 md:p-8 text-center transition-transform hover:scale-105 duration-300 shadow-sm hover:shadow-md">
              <div className="text-2xl sm:text-3xl md:text-4xl text-pink-500 mb-2 sm:mb-3 md:mb-4 flex justify-center">
                <i className="ri-team-line"></i>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 md:mb-3">Giáo viên chuyên nghiệp</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Đội ngũ giáo viên giàu kinh nghiệm, nhiệt tình và am hiểu tâm lý trẻ em.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 sm:p-6 md:p-8 text-center transition-transform hover:scale-105 duration-300 shadow-sm hover:shadow-md sm:col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl md:text-4xl text-green-500 mb-2 sm:mb-3 md:mb-4 flex justify-center">
                <i className="ri-gamepad-line"></i>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 md:mb-3">Học qua trò chơi</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Các bài học được thiết kế dưới dạng trò chơi giúp trẻ học mà chơi, chơi mà học.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">Khóa học theo chủ đề</h2>
          <p className="text-center text-gray-600 text-sm md:text-base mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            Các khóa học được thiết kế phù hợp với từng độ tuổi và nhu cầu của trẻ, giúp phát triển toàn diện các kỹ năng tiếng Anh.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Speaking */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Cartoon%20children%20practicing%20English%20speaking%20with%20speech%20bubbles%2C%20colorful%20classroom%20setting%20with%20educational%20posters%2C%20bright%20and%20cheerful%20atmosphere%20with%20blue%20and%20yellow%20colors%2C%20kids%20engaged%20in%20conversation&width=400&height=300&seq=speaking1&orientation=landscape"
                  alt="Speaking Course"
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-2 sm:space-y-0">
                  <h3 className="text-lg md:text-xl font-bold text-blue-600">Speaking</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 md:px-3 py-1 rounded-full self-start sm:self-auto">4-12 tuổi</span>
                </div>
                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
                  Rèn luyện kỹ năng giao tiếp, phát âm và tự tin nói tiếng Anh qua các hoạt động thú vị.
                </p>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 md:py-3 px-4 rounded-lg transition duration-300 cursor-pointer text-sm md:text-base font-medium">
                  Xem chi tiết
                </button>
              </div>
            </div>
            {/* Listening */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Cartoon%20children%20wearing%20headphones%20listening%20to%20English%20audio%20lessons%2C%20colorful%20classroom%20with%20sound%20wave%20visuals%2C%20educational%20setting%20with%20listening%20activities%2C%20bright%20and%20cheerful%20atmosphere%20with%20pink%20and%20blue%20colors&width=400&height=300&seq=listening1&orientation=landscape"
                  alt="Listening Course"
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-2 sm:space-y-0">
                  <h3 className="text-lg md:text-xl font-bold text-pink-600">Listening</h3>
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 md:px-3 py-1 rounded-full self-start sm:self-auto">4-12 tuổi</span>
                </div>
                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
                  Phát triển khả năng nghe hiểu thông qua các bài nghe sinh động và thú vị.
                </p>
                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 md:py-3 px-4 rounded-lg transition duration-300 cursor-pointer text-sm md:text-base font-medium">
                  Xem chi tiết
                </button>
              </div>
            </div>
            {/* Reading */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Cartoon%20children%20reading%20English%20books%20in%20a%20colorful%20library%20setting%2C%20educational%20environment%20with%20bookshelves%20and%20reading%20corners%2C%20bright%20and%20cheerful%20atmosphere%20with%20green%20and%20yellow%20colors%2C%20kids%20engaged%20in%20reading%20activities&width=400&height=300&seq=reading1&orientation=landscape"
                  alt="Reading Course"
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-2 sm:space-y-0">
                  <h3 className="text-lg md:text-xl font-bold text-green-600">Reading</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 md:px-3 py-1 rounded-full self-start sm:self-auto">4-12 tuổi</span>
                </div>
                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
                  Nâng cao kỹ năng đọc hiểu qua các truyện ngắn và bài đọc phù hợp với lứa tuổi.
                </p>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 md:py-3 px-4 rounded-lg transition duration-300 cursor-pointer text-sm md:text-base font-medium">
                  Xem chi tiết
                </button>
              </div>
            </div>
            {/* Writing */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Cartoon%20children%20writing%20in%20English%20notebooks%20at%20colorful%20desks%2C%20educational%20classroom%20with%20writing%20prompts%20and%20vocabulary%20charts%2C%20bright%20and%20cheerful%20atmosphere%20with%20purple%20and%20blue%20colors%2C%20kids%20engaged%20in%20creative%20writing%20activities&width=400&height=300&seq=writing1&orientation=landscape"
                  alt="Writing Course"
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-2 sm:space-y-0">
                  <h3 className="text-lg md:text-xl font-bold text-purple-600">Writing</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 md:px-3 py-1 rounded-full self-start sm:self-auto">4-12 tuổi</span>
                </div>
                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
                  Rèn luyện kỹ năng viết từ cơ bản đến nâng cao qua các bài tập thực hành thú vị.
                </p>
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 md:py-3 px-4 rounded-lg transition duration-300 cursor-pointer text-sm md:text-base font-medium">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Phụ huynh và học sinh nói gì về chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3 md:mb-4">
                <img
                  src="https://readdy.ai/api/search-image?query=Portrait%20of%20Vietnamese%20mother%20with%20child%2C%20happy%20family%20photo%2C%20natural%20lighting%2C%20clean%20background&width=60&height=60&seq=parent1&orientation=squarish"
                  alt="Parent"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mr-3 md:mr-4"
                />
                <div>
                  <h4 className="font-bold text-sm md:text-base">Chị Thiên An</h4>
                  <p className="text-gray-600 text-xs md:text-sm">Phụ huynh học sinh</p>
                </div>
              </div>
              <p className="text-gray-600 italic text-sm md:text-base leading-relaxed mb-3 md:mb-4">
                "Con tôi học tại NextGen English được 6 tháng và đã có tiến bộ rõ rệt. Các thầy cô rất nhiệt tình và phương pháp giảng dạy vui nhộn khiến con rất thích thú với việc học tiếng Anh."
              </p>
              <div className="flex text-yellow-400 space-x-1">
                <i className="ri-star-fill text-sm md:text-base"></i>
                <i className="ri-star-fill text-sm md:text-base"></i>
                <i className="ri-star-fill text-sm md:text-base"></i>
                <i className="ri-star-fill text-sm md:text-base"></i>
                <i className="ri-star-fill text-sm md:text-base"></i>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src="https://readdy.ai/api/search-image?query=Portrait%20of%20Vietnamese%20father%20with%20child%2C%20happy%20family%20photo%2C%20natural%20lighting%2C%20clean%20background&width=60&height=60&seq=parent2&orientation=squarish"
                  alt="Parent"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Anh Phương Tuấn</h4>
                  <p className="text-gray-600 text-sm">Phụ huynh học sinh</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Tôi rất hài lòng với sự tiến bộ của con. Đặc biệt là kỹ năng giao tiếp đã cải thiện rõ rệt. Giáo viên rất tận tâm và luôn cập nhật tình hình học tập của con cho chúng tôi."
              </p>
              <div className="mt-4 text-yellow-400 flex">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src="https://readdy.ai/api/search-image?query=Portrait%20of%20Vietnamese%20child%20student%20smiling%2C%20happy%20expression%2C%20natural%20lighting%2C%20clean%20background&width=60&height=60&seq=student1&orientation=squarish"
                  alt="Student"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Bé Sol</h4>
                  <p className="text-gray-600 text-sm">Học sinh lớp 4</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Em rất thích học tiếng Anh ở đây. Các cô giáo dạy rất vui và em được chơi nhiều trò chơi. Em đã có thể nói chuyện với bạn nước ngoài và hiểu được phim hoạt hình tiếng Anh."
              </p>
              <div className="mt-4 text-yellow-400 flex">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Trial */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 md:mb-6">Bắt đầu học tiếng Anh ngay hôm nay!</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed opacity-90 px-2">
            Đăng ký khóa học thử miễn phí và trải nghiệm phương pháp học tiếng Anh hiệu quả tại NextGen English.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-full text-sm sm:text-base md:text-lg font-bold transition duration-300 cursor-pointer shadow-lg hover:shadow-xl min-h-[44px] touch-manipulation">
            Đăng ký học thử miễn phí
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-3xl text-blue-400 mr-2">
                  <i className="fas fa-book-reader"></i>
                </div>
                <h3 className="text-2xl font-bold text-white">NextGen English</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Nền tảng học tiếng Anh trực tuyến hàng đầu dành cho trẻ em Việt Nam.
              </p>
              <div className="flex space-x-4">
                <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-youtube"></i>
                </button>
                <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-instagram"></i>
                </button>
                <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-tiktok"></i>
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2">
                <li>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Trung tâm hỗ trợ</button>
                </li>
                <li>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Khóa học</button>
                </li>
                <li>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Lớp học gia sư</button>
                </li>
                <li>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Thanh toán</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2">
                <li>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Trung tâm hỗ trợ</button>
                </li>
                <li>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Câu hỏi thường gặp</button>
                </li>
                <li>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Liên hệ</button>
                </li>
                <li>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Chính sách bảo mật</button>
                </li>
                <li>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Điều khoản sử dụng</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Liên hệ</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-2 text-blue-400"></i>
                  <span className="text-gray-400">600 Nguyen Van Cu St., Ninh Kieu, Can Tho</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt mr-2 text-blue-400"></i>
                  <span className="text-gray-400">+84 91 7678 578</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2 text-blue-400"></i>
                  <span className="text-gray-400">nextgen.English.2025.06@gmail.com</span>
                </li>
              </ul>
              <div className="mt-4">
                <h4 className="text-lg font-bold mb-2">Thanh toán</h4>
                <div className="flex space-x-3">
                  <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
                  <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
                  <i className="fab fa-cc-paypal text-2xl text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NextGen English. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home; 