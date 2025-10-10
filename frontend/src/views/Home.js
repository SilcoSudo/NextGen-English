import React from "react";
import { useAuth } from "../models/AuthContext";

function Home() {
  const { isAuthenticated } = useAuth();

  const handleLearnNowClick = () => {
    if (isAuthenticated) {
      // Đã đăng nhập - chuyển đến tab bài học
      window.location.hash = "#/lessons";
    } else {
      // Chưa đăng nhập - chuyển đến trang đăng nhập
      window.location.hash = "#/login";
    }
  };
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://readdy.ai/api/search-image?query=Colorful%20cartoon%20illustration%20of%20happy%20diverse%20children%20learning%20English%20with%20books%20and%20tablets%2C%20surrounded%20by%20floating%20English%20letters%20and%20words%2C%20bright%20cheerful%20background%20with%20blue%2C%20yellow%2C%20pink%20and%20green%20colors%2C%20fun%20educational%20setting&width=1440&height=600&seq=hero1&orientation=landscape"
            alt="Children learning English"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-transparent"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-5 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/30 to-purple-500/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-10 w-20 h-20 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-full blur-md animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Content */}
            <div className="lg:col-span-7 text-white text-center lg:text-left">
              <div className="space-y-2 mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Chương trình học hiện đối mới nhất 2025
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                <span className="block">Học Tiếng Anh</span>
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Qua Bài Học Tương Tác
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed opacity-90 max-w-2xl mx-auto lg:mx-0">
                Khám phá thư viện bài học tiếng Anh phong phú, từ cơ bản đến nâng cao. 
                <span className="block mt-2 font-semibold text-yellow-300">Sở hữu từng bài học theo nhu cầu học tập!</span>
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-yellow-300">500+</div>
                  <div className="text-sm opacity-80">Bài học</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-yellow-300">1000+</div>
                  <div className="text-sm opacity-80">Học viên</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-yellow-300">4.9⭐</div>
                  <div className="text-sm opacity-80">Đánh giá</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start max-w-2xl mx-auto lg:mx-0">
                <a href="#/lessons" className="group w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-blue-900 py-4 px-8 rounded-2xl text-base md:text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 min-h-[56px] touch-manipulation inline-flex items-center justify-center">
                  <span className="flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Khám phá bài học</span>
                    <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </a>
                <button 
                  onClick={handleLearnNowClick}
                  className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/50 hover:border-white/70 py-4 px-8 rounded-2xl text-base md:text-lg font-bold transition-all duration-300 hover:scale-105 min-h-[56px] touch-manipulation"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>▶️</span>
                    <span>{isAuthenticated ? "Học ngay" : "Đăng nhập để học"}</span>
                  </span>
                </button>
              </div>
            </div>
            
            {/* Interactive Elements */}
            <div className="lg:col-span-5 hidden lg:block relative">
              <div className="relative">
                {/* Floating Cards */}
                <div className="absolute -top-10 -right-10 bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
                    <span className="text-white font-medium">Alphabet</span>
                  </div>
                </div>
                
                <div className="absolute top-20 -left-10 bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white">🎵</div>
                    <span className="text-white font-medium">Phonics</span>
                  </div>
                </div>
                
                <div className="absolute bottom-10 right-0 bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white">💬</div>
                    <span className="text-white font-medium">Speaking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Features */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Tại sao chọn chúng tôi?
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Tại sao chọn{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                NextGen English
              </span>
              ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Khám phá những lý do khiến hàng ngàn phụ huynh và học sinh tin tưởng chọn chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg: gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/20">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto transform transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <i className="ri-graduation-cap-line text-3xl text-white"></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs">✨</span>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Phương pháp học hiệu quả</h3>
                <p className="text-gray-600 leading-relaxed">
                  Phương pháp giảng dạy tương tác hiện đại, kết hợp công nghệ AI giúp trẻ tiếp thu kiến thức nhanh chóng và hiệu quả.
                </p>
                <div className="mt-6 text-blue-500 font-semibold">
                  Tăng 95% hiệu quả học tập →
                </div>
              </div>
            </div>


            {/* Feature 3 */}
            <div className="group relative md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/20">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto transform transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <i className="ri-gamepad-line text-3xl text-white"></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs">🎮</span>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Học qua trò chơi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Gamification với hệ thống thưởng và level up giúp trẻ luôn hứng thú và động lực trong quá trình học tập.
                </p>
                <div className="mt-6 text-green-500 font-semibold">
                  500+ mini games tương tác →
                </div>
              </div>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600 text-sm">Hỗ trợ học tập</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600 text-sm">Hoàn tiền nếu không hài lòng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">AI</div>
              <div className="text-gray-600 text-sm">Đánh giá tiến độ thông minh</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
              <div className="text-gray-600 text-sm">Truy cập không giới hạn</div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6 border border-white/20">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Chương trình học đa dạng
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Bài Học Theo</span>
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                Kỹ Năng Cốt Lõi
              </span>
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              Phát triển toàn diện 4 kỹ năng tiếng Anh với phương pháp học tập hiện đại và tương tác
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Speaking */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/20">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src="https://readdy.ai/api/search-image?query=Cartoon%20children%20practicing%20English%20speaking%20with%20speech%20bubbles%2C%20colorful%20classroom%20setting%20with%20educational%20posters%2C%20bright%20and%20cheerful%20atmosphere%20with%20blue%20and%20yellow%20colors%2C%20kids%20engaged%20in%20conversation&width=400&height=300&seq=speaking1&orientation=landscape"
                    alt="Speaking Course"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                      <i className="ri-mic-line text-xl text-white"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-white">Speaking</h3>
                    <span className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30">4-12 tuổi</span>
                  </div>
                  <p className="text-white/80 text-sm mb-4 leading-relaxed">
                    Rèn luyện kỹ năng giao tiếp, phát âm chuẩn và tự tin nói tiếng Anh.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">
                      <span className="flex items-center">
                        <i className="ri-play-circle-line mr-1"></i>
                        50+ bài học
                      </span>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 border border-white/20">
                      Học ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Listening */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/20">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src="https://readdy.ai/api/search-image?query=Cartoon%20children%20wearing%20headphones%20listening%20to%20English%20audio%20lessons%2C%20colorful%20classroom%20with%20sound%20wave%20visuals%2C%20educational%20setting%20with%20listening%20activities%2C%20bright%20and%20cheerful%20atmosphere%20with%20pink%20and%20blue%20colors&width=400&height=300&seq=listening1&orientation=landscape"
                    alt="Listening Course"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center">
                      <i className="ri-headphone-line text-xl text-white"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-white">Listening</h3>
                    <span className="bg-pink-500/20 text-pink-300 text-xs px-3 py-1 rounded-full border border-pink-500/30">4-12 tuổi</span>
                  </div>
                  <p className="text-white/80 text-sm mb-4 leading-relaxed">
                    Phát triển khả năng nghe hiểu qua các bài nghe sinh động và thú vị.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">
                      <span className="flex items-center">
                        <i className="ri-play-circle-line mr-1"></i>
                        40+ bài học
                      </span>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 border border-white/20">
                      Học ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reading */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/20">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src="https://readdy.ai/api/search-image?query=Cartoon%20children%20reading%20English%20books%20in%20a%20colorful%20library%20setting%2C%20educational%20environment%20with%20bookshelves%20and%20reading%20corners%2C%20bright%20and%20cheerful%20atmosphere%20with%20green%20and%20yellow%20colors%2C%20kids%20engaged%20in%20reading%20activities&width=400&height=300&seq=reading1&orientation=landscape"
                    alt="Reading Course"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                      <i className="ri-book-open-line text-xl text-white"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-white">Reading</h3>
                    <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30">4-12 tuổi</span>
                  </div>
                  <p className="text-white/80 text-sm mb-4 leading-relaxed">
                    Nâng cao kỹ năng đọc hiểu qua truyện ngắn và bài đọc phù hợp.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">
                      <span className="flex items-center">
                        <i className="ri-play-circle-line mr-1"></i>
                        60+ bài học
                      </span>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 border border-white/20">
                      Học ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Writing */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/20">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src="https://readdy.ai/api/search-image?query=Cartoon%20children%20writing%20in%20English%20notebooks%20at%20colorful%20desks%2C%20educational%20classroom%20with%20writing%20prompts%20and%20vocabulary%20charts%2C%20bright%20and%20cheerful%20atmosphere%20with%20purple%20and%20blue%20colors%2C%20kids%20engaged%20in%20creative%20writing%20activities&width=400&height=300&seq=writing1&orientation=landscape"
                    alt="Writing Course"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                      <i className="ri-edit-line text-xl text-white"></i>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-white">Writing</h3>
                    <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">4-12 tuổi</span>
                  </div>
                  <p className="text-white/80 text-sm mb-4 leading-relaxed">
                    Rèn luyện kỹ năng viết từ cơ bản đến nâng cao một cách thú vị.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">
                      <span className="flex items-center">
                        <i className="ri-play-circle-line mr-1"></i>
                        45+ bài học
                      </span>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 border border-white/20">
                      Học ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Phản hồi từ cộng đồng
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-800">
              <span className="block">Phụ huynh và học sinh</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                nói gì về chúng tôi
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hàng nghìn phụ huynh và học sinh đã tin tưởng lựa chọn NextGen English
            </p>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Testimonial 1 
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💙</span>
                </div>
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src="https://readdy.ai/api/search-image?query=Portrait%20of%20Vietnamese%20mother%20with%20child%2C%20happy%20family%20photo%2C%20natural%20lighting%2C%20clean%20background&width=60&height=60&seq=parent1&orientation=squarish"
                      alt="Parent"
                      className="w-14 h-14 rounded-2xl object-cover ring-4 ring-blue-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg text-gray-800">Chị Thiên An</h4>
                    <p className="text-blue-600 text-sm font-medium">Phụ huynh học sinh</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 italic text-base leading-relaxed">
                    "Con tôi học tại NextGen English được 6 tháng và đã có tiến bộ rõ rệt. Các thầy cô rất nhiệt tình và phương pháp giảng dạy vui nhộn khiến con rất thích thú với việc học tiếng Anh."
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400 space-x-1">
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    6 tháng trước
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💜</span>
                </div>
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src="https://readdy.ai/api/search-image?query=Portrait%20of%20Vietnamese%20father%20with%20child%2C%20happy%20family%20photo%2C%20natural%20lighting%2C%20clean%20background&width=60&height=60&seq=parent2&orientation=squarish"
                      alt="Parent"
                      className="w-14 h-14 rounded-2xl object-cover ring-4 ring-purple-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg text-gray-800">Anh Phương Tuấn</h4>
                    <p className="text-purple-600 text-sm font-medium">Phụ huynh học sinh</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 italic text-base leading-relaxed">
                    "Tôi rất hài lòng với sự tiến bộ của con. Đặc biệt là kỹ năng giao tiếp đã cải thiện rõ rệt. Giáo viên rất tận tâm và luôn cập nhật tình hình học tập cho chúng tôi."
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400 space-x-1">
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-half-line text-lg"></i>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    3 tháng trước
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 
            <div className="group relative md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💚</span>
                </div>
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src="https://readdy.ai/api/search-image?query=Portrait%20of%20Vietnamese%20child%20student%20smiling%2C%20happy%20expression%2C%20natural%20lighting%2C%20clean%20background&width=60&height=60&seq=student1&orientation=squarish"
                      alt="Student"
                      className="w-14 h-14 rounded-2xl object-cover ring-4 ring-green-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs">⭐</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg text-gray-800">Bé Sol</h4>
                    <p className="text-green-600 text-sm font-medium">Học sinh lớp 4</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 italic text-base leading-relaxed">
                    "Em rất thích học tiếng Anh ở đây. Các cô giáo dạy rất vui và em được chơi nhiều trò chơi. Em đã có thể nói chuyện với bạn nước ngoài và hiểu phim hoạt hình tiếng Anh!"
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400 space-x-1">
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                    <i className="ri-star-fill text-lg"></i>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    1 tháng trước
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">4.9/5</div>
              <div className="text-gray-600 text-sm">Đánh giá trung bình</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">1000+</div>
              <div className="text-gray-600 text-sm">Phụ huynh hài lòng</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">98%</div>
              <div className="text-gray-600 text-sm">Tỷ lệ tiến bộ</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-gray-600 text-sm">Hỗ trợ tận tình</div>
            </div>
          </div>
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