import React, { useState, useMemo, useEffect } from "react";
import LessonCard from "./LessonCard";

const ageOptions = ["6-8 tuổi", "8-10 tuổi"];
const levelOptions = ["Cơ bản", "Trung cấp", "Nâng cao"];
const skillOptions = ["Nói", "Nghe", "Đọc", "Viết"];

function ExploreLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAges, setSelectedAges] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  // Transform database lesson object to safe display format
  const transformLesson = (lesson) => {
    if (!lesson || typeof lesson !== 'object') {
      return null;
    }

    return {
      _id: lesson._id,
      id: lesson.id || lesson._id,
      title: String(lesson.title || 'Untitled Lesson'),
      description: String(lesson.description || 'No description'),
      level: String(lesson.level || 'Beginner'),
      ageGroup: String(lesson.ageGroup || 'all'),
      category: String(lesson.category || 'general'),
      
      // Safe thumbnail handling
      thumbnail: lesson.thumbnail || lesson.video?.thumbnail || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&auto=format&q=80',
      
      // Skills array
      skills: Array.isArray(lesson.skills) ? lesson.skills : [],
      
      // Learning objectives
      objectives: Array.isArray(lesson.objectives) ? lesson.objectives : [],
      
      // Transform price/pricing object
      price: (() => {
        if (lesson.pricing && typeof lesson.pricing === 'object') {
          if (lesson.pricing.type === 'free' || lesson.pricing.price === 0) {
            return 'Free';
          }
          const price = lesson.pricing.discountPrice || lesson.pricing.price;
          return price ? `${price.toLocaleString('vi-VN')}đ` : 'Free';
        }
        if (typeof lesson.price === 'number') {
          return lesson.price === 0 ? 'Free' : `${lesson.price.toLocaleString('vi-VN')}đ`;
        }
        return 'Free';
      })(),
      
      // Safe numeric properties from stats or direct properties
      duration: lesson.video?.duration || lesson.duration || 0,
      purchases: lesson.totalPurchases || lesson.stats?.totalPurchases || 0,
      rating: lesson.averageRating || lesson.stats?.averageRating || 0,
      
      // Teacher info from createdBy object
      teacherName: (() => {
        if (lesson.createdBy && typeof lesson.createdBy === 'object') {
          return String(lesson.createdBy.name || 'Unknown Teacher');
        }
        if (typeof lesson.teacherName === 'string') return lesson.teacherName;
        return 'Unknown Teacher';
      })(),
      
      teacherAvatar: (() => {
        if (lesson.createdBy && typeof lesson.createdBy === 'object') {
          return lesson.createdBy.avatar || '/avatar/default-teacher.jpg';
        }
        if (typeof lesson.teacherAvatar === 'string') return lesson.teacherAvatar;
        return '/avatar/default-teacher.jpg';
      })(),

      // Additional properties from API
      totalReviews: lesson.stats?.totalReviews || 0,
      isPublished: lesson.settings?.isPublished || true,
      isPurchased: lesson.isPurchased || false // This would come from user context
    };
  };

  // Load lessons from API
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        console.log('🔄 Fetching lessons from API...');
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/lessons`);
        
        console.log('📡 API Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📚 Raw lessons API response:', data);
          console.log('📊 Raw lessons count:', data.data?.length || 0);
          
          let rawLessons = data.data || data.lessons || [];
          if (!Array.isArray(rawLessons)) {
            console.warn('⚠️ Expected array but got:', typeof rawLessons);
            rawLessons = [];
          }
          
          // Transform each lesson to safe format
          const transformedLessons = rawLessons
            .map((lesson, index) => {
              console.log(`🔧 Transforming lesson ${index + 1}:`, lesson.title);
              return transformLesson(lesson);
            })
            .filter(lesson => lesson !== null);
          
          console.log('✅ Transformed lessons:', transformedLessons);
          console.log('📊 Final lessons count:', transformedLessons.length);
          setLessons(transformedLessons);
        } else {
          console.error('❌ Failed to fetch lessons:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('❌ Error response:', errorText);
          setLessons([]);
        }
      } catch (error) {
        console.error('💥 Fetch error:', error);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Lọc và tìm kiếm bài học
  const filteredLessons = useMemo(() => {
    console.log('🔍 Filtering lessons:', lessons);
    if (!Array.isArray(lessons)) {
      console.warn('⚠️ Lessons is not an array:', lessons);
      return [];
    }
    
    let lessonsData = lessons.filter(lesson => {
      // Tìm kiếm theo tên
      if (searchQuery && !lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) 
          && !lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // Lọc theo độ tuổi
      if (selectedAges.length > 0 && !selectedAges.includes(lesson.ageGroup)) return false;
      // Lọc theo trình độ
      if (selectedLevels.length > 0 && !selectedLevels.includes(lesson.level)) return false;
      // Lọc theo kỹ năng
      if (selectedSkills.length > 0 && !selectedSkills.some(skill => lesson.skills?.includes(skill))) return false;
      return true;
    });

    // Sắp xếp
    lessonsData.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.purchases || 0) - (a.purchases || 0);
        case 'price-low':
          return (parseInt(a.price?.replace(/[^\d]/g, '') || '0')) - (parseInt(b.price?.replace(/[^\d]/g, '') || '0'));
        case 'price-high':
          return (parseInt(b.price?.replace(/[^\d]/g, '') || '0')) - (parseInt(a.price?.replace(/[^\d]/g, '') || '0'));
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return (b.id || 0) - (a.id || 0); // newest
      }
    });

    return lessonsData;
  }, [lessons, selectedAges, selectedLevels, selectedSkills, searchQuery, sortBy]);

  // Xử lý tick filter
  const handleFilterChange = (type, value) => {
    if (type === 'age') {
      setSelectedAges(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    } else if (type === 'level') {
      setSelectedLevels(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    } else if (type === 'skill') {
      setSelectedSkills(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài học...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-12 sm:pb-16 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
              Khám Phá Bài Học
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
              Mua từng bài học riêng lẻ phù hợp với nhu cầu học tập của bạn. 
              Mỗi bài học là một video chất lượng cao với quyền truy cập trọn đời!
            </p>

            {/* Modern Search Bar */}
            <div className="w-full max-w-2xl mx-auto mb-8 px-2">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-14 pr-20 sm:pr-24 bg-white/80 backdrop-blur-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm sm:text-lg placeholder-gray-400 hover:border-gray-300"
                />
                <div className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors text-sm sm:text-base">
                  🔍
                </div>
                <button className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105">
                  <span className="hidden sm:inline">Tìm kiếm</span>
                  <span className="sm:hidden">Tìm</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 px-2">
              {['Phổ biến nhất', 'Mới nhất', 'Miễn phí', 'Cơ bản', 'Nâng cao'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 sm:px-6 py-1.5 sm:py-2 bg-white/60 backdrop-blur-lg border border-gray-200 rounded-full text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 font-medium text-xs sm:text-sm whitespace-nowrap"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{lessons.length}+</div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm">Bài học chất lượng</div>
            </div>
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm">Lượt mua</div>
            </div>
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">4.8⭐</div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm">Đánh giá trung bình</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Controls Bar */}
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-white/20 mx-2 sm:mx-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center justify-center sm:justify-start">
              <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">
                Tìm thấy <span className="text-blue-600 font-bold">{filteredLessons.length}</span> bài học
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Sort Dropdown */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Xem dạng lưới"
                >
                  <i className="ri-grid-line text-sm sm:text-base"></i>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Xem dạng danh sách"
                >
                  <i className="ri-list-check text-sm sm:text-base"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
        {/* Modern Sidebar */}
        <aside className="lg:col-span-3 px-2 lg:px-0">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => document.getElementById('mobile-filters').classList.toggle('hidden')}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl text-gray-700 font-medium hover:bg-white/90 transition-colors shadow-md text-sm"
            >
              <i className="ri-equalizer-line text-blue-500 text-base"></i>
              <span>Bộ lọc tìm kiếm</span>
              <i className="ri-arrow-down-s-line text-gray-500 text-sm"></i>
            </button>
          </div>
          
          <div id="mobile-filters" className="hidden lg:block mb-4 lg:mb-0">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 sticky top-24 border border-white/20 shadow-lg overflow-hidden">
            {/* Clear Filters Button */}
            {(selectedAges.length > 0 || selectedLevels.length > 0 || selectedSkills.length > 0) && (
              <div className="mb-6 pb-6 border-b border-gray-100">
                <button 
                  onClick={() => {
                    setSelectedAges([]);
                    setSelectedLevels([]);
                    setSelectedSkills([]);
                  }}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>🗑️</span>
                  <span>Xóa tất cả bộ lọc</span>
                </button>
              </div>
            )}

            {/* Age filter */}
            <div className="mb-8">
              <h3 className="flex items-center space-x-2 font-bold text-gray-800 mb-4">
                <span className="text-lg">👶</span>
                <span>Độ tuổi</span>
              </h3>
              <div className="space-y-3">
                {ageOptions.map((age) => (
                  <label className="group flex items-center cursor-pointer hover:bg-blue-50 p-2 rounded-xl transition-all duration-200" key={age}>
                    <input
                      type="checkbox"
                      className="hidden"
                      name="age"
                      value={age}
                      checked={selectedAges.includes(age)}
                      onChange={() => handleFilterChange('age', age)}
                    />
                    <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                      selectedAges.includes(age) 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform scale-110' 
                        : 'border-gray-300 bg-white group-hover:border-blue-300 group-hover:shadow-sm'
                    }`}>
                      <span className={`text-white text-sm font-bold ${selectedAges.includes(age) ? 'animate-bounce' : 'hidden'}`}>
                        ✓
                      </span>
                    </div>
                    <span className={`font-medium transition-colors ${
                      selectedAges.includes(age) ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
                    }`}>
                      {age}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {/* Level filter */}
            <div className="mb-8">
              <h3 className="flex items-center space-x-2 font-bold text-gray-800 mb-4">
                <span className="text-lg">📊</span>
                <span>Trình độ</span>
              </h3>
              <div className="space-y-3">
                {levelOptions.map((level) => (
                  <label className="group flex items-center cursor-pointer hover:bg-purple-50 p-2 rounded-xl transition-all duration-200" key={level}>
                    <input
                      type="checkbox"
                      className="hidden"
                      name="level"
                      value={level}
                      checked={selectedLevels.includes(level)}
                      onChange={() => handleFilterChange('level', level)}
                    />
                    <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                      selectedLevels.includes(level) 
                        ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg transform scale-110' 
                        : 'border-gray-300 bg-white group-hover:border-purple-300 group-hover:shadow-sm'
                    }`}>
                      <span className={`text-white text-sm font-bold ${selectedLevels.includes(level) ? 'animate-bounce' : 'hidden'}`}>
                        ✓
                      </span>
                    </div>
                    <span className={`font-medium transition-colors ${
                      selectedLevels.includes(level) ? 'text-purple-600' : 'text-gray-700 group-hover:text-purple-600'
                    }`}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {/* Skill filter */}
            <div className="mb-8">
              <h3 className="flex items-center space-x-2 font-bold text-gray-800 mb-4">
                <span className="text-lg">🎯</span>
                <span>Kỹ năng</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {skillOptions.map((skill) => (
                  <label className="group flex items-center cursor-pointer hover:bg-green-50 p-2 rounded-xl transition-all duration-200" key={skill}>
                    <input
                      type="checkbox"
                      className="hidden"
                      name="skill"
                      value={skill}
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleFilterChange('skill', skill)}
                    />
                    <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center mr-2 transition-all duration-300 ${
                      selectedSkills.includes(skill) 
                        ? 'border-green-500 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg transform scale-110' 
                        : 'border-gray-300 bg-white group-hover:border-green-300 group-hover:shadow-sm'
                    }`}>
                      <span className={`text-white text-xs font-bold ${selectedSkills.includes(skill) ? 'animate-bounce' : 'hidden'}`}>
                        ✓
                      </span>
                    </div>
                    <span className={`text-sm font-medium transition-colors ${
                      selectedSkills.includes(skill) ? 'text-green-600' : 'text-gray-700 group-hover:text-green-600'
                    }`}>
                      {skill}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {/* Price filter với modern design */}
            <div>
              <h3 className="flex items-center space-x-2 font-bold text-gray-800 mb-4">
                <span className="text-lg">💰</span>
                <span>Khoảng giá</span>
              </h3>
              
              {/* Price range buttons */}
              <div className="space-y-2 mb-6">
                {[
                  { label: 'Miễn phí', min: 0, max: 0 },
                  { label: 'Dưới 50k', min: 0, max: 50000 },
                  { label: '50k - 100k', min: 50000, max: 100000 },
                  { label: 'Trên 100k', min: 100000, max: 500000 }
                ].map((range, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 border border-gray-200 hover:border-orange-300 rounded-xl text-sm font-medium text-gray-700 hover:text-orange-600 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span>{range.label}</span>
                      <span className="text-xs text-gray-400 group-hover:text-orange-400">
                        {lessons.filter(l => {
                          const price = parseInt(l.price?.replace(/[^\d]/g, '') || '0');
                          return range.max === 0 ? price === 0 : price >= range.min && price <= range.max;
                        }).length} bài học
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Apply Filter Button */}
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="flex items-center justify-center space-x-2">
                  <span>✨</span>
                  <span>Áp dụng bộ lọc</span>
                </span>
              </button>
            </div>
          </div>
          </div>
        </aside>
        {/* Lesson list */}
        <div className="lg:col-span-9 px-2 lg:px-0">
          <div className={`grid gap-3 sm:gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.isArray(filteredLessons) && filteredLessons.map((lesson) => {
              if (!lesson || typeof lesson !== 'object') {
                console.error('❌ Invalid lesson object:', lesson);
                return null;
              }
              return (
                <LessonCard key={lesson._id || lesson.id || Math.random()} lesson={lesson} />
              );
            }).filter(Boolean)}
          </div>
          {/* Modern Pagination */}
          <div className="flex flex-col items-center justify-center mt-8 md:mt-12 space-y-6">
            {/* Items per page - Hidden on mobile for simplicity */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>Hiển thị</span>
              <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-blue-300 transition-colors">
                <option>9</option>
                <option>12</option>
                <option>15</option>
              </select>
              <span>trong tổng số <span className="font-bold text-blue-600">{filteredLessons.length}</span> bài học</span>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Previous Button */}
              <button className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-400 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                <i className="ri-arrow-left-line"></i>
              </button>
              
              {/* Page Numbers - Responsive visibility */}
              <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg">
                1
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all">
                2
              </button>
              <span className="hidden sm:inline px-2 py-1 text-gray-400">...</span>
              <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all">
                10
              </button>
              
              {/* Next Button */}
              <button className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>

            {/* Mobile-friendly page info */}
            <div className="md:hidden text-center text-sm text-gray-600">
              Trang 1 của 10 • <span className="font-bold text-blue-600">{filteredLessons.length}</span> bài học
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

export default ExploreLessons;