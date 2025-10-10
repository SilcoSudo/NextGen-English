import React from "react";
import { useNavigate } from "react-router-dom";

function LessonCard({ lesson }) {
  const navigate = useNavigate();
  
  // Debug validation
  if (!lesson || typeof lesson !== 'object') {
    console.error('❌ LessonCard: Invalid lesson object:', lesson);
    return <div>Invalid lesson data</div>;
  }
  
  // Transform database objects to display values
  const safeLesson = {
    ...lesson,
    title: typeof lesson.title === 'string' ? lesson.title : 'Untitled Lesson',
    description: typeof lesson.description === 'string' ? lesson.description : 'No description',
    level: typeof lesson.level === 'string' ? lesson.level : 'Unknown',
    ageGroup: typeof lesson.ageGroup === 'string' ? lesson.ageGroup : '',
    
    // Transform pricing object to price string
    price: (() => {
      if (typeof lesson.price === 'string') return lesson.price;
      if (lesson.pricing && typeof lesson.pricing === 'object') {
        if (lesson.pricing.type === 'free' || lesson.pricing.price === 0) {
          return 'Free';
        }
        const price = lesson.pricing.discountPrice || lesson.pricing.price;
        return price ? `${price.toLocaleString('vi-VN')}đ` : 'Free';
      }
      return 'Free';
    })(),
    
    // Handle skills array
    skills: Array.isArray(lesson.skills) ? lesson.skills : [],
    
    // Transform teacher info
    teacherName: (() => {
      if (typeof lesson.teacherName === 'string') return lesson.teacherName;
      if (lesson.createdBy && typeof lesson.createdBy === 'object') {
        return lesson.createdBy.name || 'Unknown Teacher';
      }
      return 'Unknown Teacher';
    })(),
    
    teacherAvatar: (() => {
      if (lesson.createdBy && typeof lesson.createdBy === 'object' && lesson.createdBy.avatar) {
        return lesson.createdBy.avatar;
      }
      return null;
    })(),
    
    // Transform stats
    purchases: lesson.totalPurchases || lesson.stats?.totalPurchases || 0,
    rating: lesson.averageRating || lesson.stats?.averageRating || 0,
    
    // Video info
    duration: lesson.video?.duration || lesson.duration || 0,
    thumbnail: lesson.thumbnail || lesson.video?.thumbnail
  };
  
  lesson = safeLesson;

  const handleClick = (e) => {
    const lessonId = lesson._id || lesson.id;
    
    // Purchase lesson button
    if (e.target.name === "purchase") {
      e.stopPropagation();
      navigate(`/payment?lessonId=${lessonId}`);
    }
    // Watch lesson button (if already purchased)
    else if (e.target.name === "watch") {
      e.stopPropagation();
      navigate(`/lessons/${lessonId}/watch`);
    }
  };

  // Check if lesson is purchased (this would come from user context/props)
  const isPurchased = lesson.isPurchased || false;

  return (
    <div className="group bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-white/20">
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 rounded-2xl"></div>
      
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-2xl">
          <img 
            src={lesson.thumbnail || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&auto=format&q=80'} 
            alt={lesson.title} 
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {/* Video duration overlay */}
          {lesson.duration > 0 && (
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-lg px-3 py-1 rounded-full text-white text-sm font-medium">
              {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          {/* Rating badge */}
          {lesson.rating && typeof lesson.rating === 'number' && lesson.rating > 0 && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-lg px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-bold text-gray-800">{lesson.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Purchased badge */}
          {isPurchased && (
            <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-lg px-3 py-1 rounded-full text-white text-sm font-bold shadow-lg">
              ✓ Đã mua
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 relative z-10">
        {/* Tags và Age */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm">
              {lesson.level}
            </div>
            {lesson.ageGroup && (
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                👶 {lesson.ageGroup}
              </div>
            )}
          </div>
          {lesson.purchases && typeof lesson.purchases === 'number' && lesson.purchases > 0 && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {lesson.purchases} lượt mua
            </div>
          )}
        </div>

        {/* Title with gradient */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {lesson.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">{lesson.description}</p>

        {/* Learning objectives */}
        {lesson.objectives && Array.isArray(lesson.objectives) && lesson.objectives.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Bạn sẽ học được:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {lesson.objectives.slice(0, 2).map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{objective}</span>
                </li>
              ))}
              {lesson.objectives.length > 2 && (
                <li className="text-gray-400 text-xs">
                  +{lesson.objectives.length - 2} mục tiêu khác
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Skills tags */}
        {lesson.skills && Array.isArray(lesson.skills) && lesson.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {lesson.skills.slice(0, 3).map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200"
              >
                {typeof skill === 'string' ? skill : String(skill)}
              </span>
            ))}
            {lesson.skills.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                +{lesson.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Teacher Info */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <img 
              src={lesson.teacherAvatar || '/avatar/emma.jpg'} 
              className="w-10 h-10 rounded-full border-3 border-white shadow-md" 
              alt="Teacher" 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-gray-800">{lesson.teacherName}</p>
            <p className="text-xs text-gray-500">Giáo viên</p>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {lesson.price}
              </span>
              {lesson.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{lesson.originalPrice}</span>
              )}
            </div>
            {lesson.originalPrice && (
              <div className="text-xs text-green-600 font-medium">
                Tiết kiệm {Math.round((1 - parseInt(lesson.price.replace(/[^\d]/g, '')) / parseInt(lesson.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
              </div>
            )}
          </div>
          
          {isPurchased ? (
            <button
              name="watch"
              className="group/btn px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={handleClick}
            >
              <span className="flex items-center space-x-2">
                <span>Xem bài học</span>
                <span className="transform group-hover/btn:translate-x-1 transition-transform">▶️</span>
              </span>
            </button>
          ) : (
            <button
              name="purchase"
              className="group/btn px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={handleClick}
            >
              <span className="flex items-center space-x-2">
                <span>Mua ngay</span>
                <span className="transform group-hover/btn:translate-x-1 transition-transform">🛒</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonCard;