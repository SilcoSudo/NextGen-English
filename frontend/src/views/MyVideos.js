import React, { useState } from "react";
import VideoCard from "./VideoCard";
import mockVideos from "./mockVideos";

function MyVideos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTopic, setSelectedTopic] = useState("all");

  // Lấy danh sách video đã mua
  const purchasedVideos = mockVideos.filter(video => video.isPurchased);

  // Lọc và tìm kiếm video đã mua
  const filteredVideos = purchasedVideos.filter(video => {
    const matchesSearch = !searchQuery || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTopic = selectedTopic === "all" || video.topic === selectedTopic;
    
    return matchesSearch && matchesTopic;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'rating':
        return b.rating - a.rating;
      case 'duration':
        const aDuration = parseInt(a.duration.split(':')[0]) * 60 + parseInt(a.duration.split(':')[1]);
        const bDuration = parseInt(b.duration.split(':')[0]) * 60 + parseInt(b.duration.split(':')[1]);
        return aDuration - bDuration;
      default: // newest
        return b.id - a.id;
    }
  });

  // Lấy danh sách các topics từ video đã mua
  const availableTopics = [...new Set(purchasedVideos.map(video => video.topic))];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Bài Học Đã Sở Hữu
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Truy cập và học lại các bài học tiếng Anh mà bạn đã sở hữu. Học mọi lúc, mọi nơi!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{purchasedVideos.length}</div>
            <div className="text-gray-600 font-medium text-xs sm:text-sm">Bài học đã sở hữu</div>
          </div>
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
              {Math.floor(purchasedVideos.reduce((total, video) => {
                const [minutes, seconds] = video.duration.split(':').map(Number);
                return total + minutes + seconds/60;
              }, 0))}
            </div>
            <div className="text-gray-600 font-medium text-xs sm:text-sm">Phút học tập</div>
          </div>
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
              {availableTopics.length}
            </div>
            <div className="text-gray-600 font-medium text-xs sm:text-sm">Chủ đề khác nhau</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài học đã sở hữu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                />
                <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="flex-1 px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="all">Tất cả chủ đề</option>
                {availableTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="newest">Mới nhất</option>
                <option value="alphabetical">A-Z</option>
                <option value="rating">Đánh giá cao</option>
                <option value="duration">Thời lượng ngắn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {purchasedVideos.length === 0 ? (
              <>
                <div className="text-6xl mb-4">📺</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có bài học nào</h3>
                <p className="text-gray-600 mb-6">Bạn chưa sở hữu bài học nào. Hãy khám phá thư viện bài học phong phú của chúng tôi!</p>
                <a
                  href="#/videos"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Khám phá bài học
                </a>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy bài học</h3>
                <p className="text-gray-600 mb-6">Không có bài học nào phù hợp với bộ lọc của bạn</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTopic('all');
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </>
            )}
          </div>
        )}

        {/* Learning Progress Section */}
        {filteredVideos.length > 0 && (
          <div className="mt-12 bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="ri-bar-chart-line text-blue-500 mr-2"></i>
              Thống kê học tập
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {purchasedVideos.filter(v => v.skill === 'Nghe').length}
                </div>
                <div className="text-xs text-gray-600">Bài học Nghe</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {purchasedVideos.filter(v => v.skill === 'Nói').length}
                </div>
                <div className="text-xs text-gray-600">Bài học Nói</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {purchasedVideos.filter(v => v.skill === 'Đọc').length}
                </div>
                <div className="text-xs text-gray-600">Bài học Đọc</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {purchasedVideos.filter(v => v.skill === 'Viết').length}
                </div>
                <div className="text-xs text-gray-600">Bài học Viết</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default MyVideos;