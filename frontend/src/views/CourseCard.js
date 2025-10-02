import React from "react";
import { useNavigate } from "react-router-dom";

function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // Card 1: Bắt đầu học
    if (course.id === 1 && e.target.name === "start") {
      e.stopPropagation();
      navigate(`/courses/${course.id}/learn`);
    }
    // Các card khác: Đăng ký học
    else if (e.target.name === "register") {
      e.stopPropagation();
      navigate(`/payment?courseId=${course.id}`);
    }
  };

  return (
    <div className="group bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-white/20">
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 rounded-2xl"></div>
      
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-2xl">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {course.label && (
            <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-lg border border-white/20 shadow-lg ${course.labelColor || 'bg-yellow-400/90 text-white'} animate-pulse`}>
              ✨ {course.label}
            </div>
          )}
          
          {/* Rating badge */}
          {course.rating > 0 && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-lg px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-bold text-gray-800">{course.rating}</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-6 relative z-10">
        {/* Tags và Age */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${course.levelColor || 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'} shadow-sm`}>
              {course.level}
            </div>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
              👶 {course.age}
            </div>
          </div>
          {course.students > 0 && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {course.students} học viên
            </div>
          )}
        </div>

        {/* Title with gradient */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">{course.description}</p>

        {/* Course Info với icon hiện đại */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <span className="text-white text-sm">⏱️</span>
            </div>
            <div>
              <div className="text-xs text-gray-500">Thời lượng</div>
              <div className="text-sm font-semibold text-gray-800">{course.weeks} tuần</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm">
              <span className="text-white text-sm">📚</span>
            </div>
            <div>
              <div className="text-xs text-gray-500">Bài học</div>
              <div className="text-sm font-semibold text-gray-800">{course.lessons} bài</div>
            </div>
          </div>
        </div>

        {/* Skills tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {course.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Teacher Info */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <img 
              src={course.teacherAvatar} 
              className="w-10 h-10 rounded-full border-3 border-white shadow-md" 
              alt="Teacher" 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-gray-800">{course.teacherName}</p>
            <p className="text-xs text-gray-500">{course.teacherRole}</p>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {course.price}
              </span>
              {course.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{course.originalPrice}</span>
              )}
            </div>
            {course.originalPrice && (
              <div className="text-xs text-green-600 font-medium">
                Tiết kiệm {Math.round((1 - parseInt(course.price.replace(/[^\d]/g, '')) / parseInt(course.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
              </div>
            )}
          </div>
          
          {course.id === 1 ? (
            <button
              name="start"
              className="group/btn px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={handleClick}
            >
              <span className="flex items-center space-x-2">
                <span>Bắt đầu học</span>
                <span className="transform group-hover/btn:translate-x-1 transition-transform">🚀</span>
              </span>
            </button>
          ) : (
            <button
              name="register"
              className="group/btn px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={handleClick}
            >
              <span className="flex items-center space-x-2">
                <span>Đăng ký học</span>
                <span className="transform group-hover/btn:translate-x-1 transition-transform">✨</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard; 