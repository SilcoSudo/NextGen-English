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
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="relative">
        <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
        {course.label && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${course.labelColor || 'bg-yellow-400 text-white'}`}>
            {course.label}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${course.levelColor || 'bg-blue-100 text-blue-700'}`}>{course.level}</div>
          <div className="w-1 h-1 bg-gray-300 rounded-full mx-2"></div>
          <div className="text-sm text-gray-600">{course.age}</div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full mr-2">
              <i className="ri-time-line text-primary"></i>
            </div>
            <span className="text-sm text-gray-600">{course.weeks} tuần học</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full mr-2">
              <i className="ri-book-open-line text-green-600"></i>
            </div>
            <span className="text-sm text-gray-600">{course.lessons} bài học</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img src={course.teacherAvatar} className="w-8 h-8 rounded-full border-2 border-white mr-2" alt="Teacher" />
            <div>
              <p className="text-sm font-medium text-gray-800">{course.teacherName}</p>
              <p className="text-xs text-gray-600">{course.teacherRole}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">{course.price}</span>
            {course.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">{course.originalPrice}</span>
            )}
          </div>
          {course.id === 1 ? (
            <button
              name="start"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-button font-medium whitespace-nowrap !rounded-button"
              onClick={handleClick}
            >
              Bắt đầu học
            </button>
          ) : (
            <button
              name="register"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-button font-medium whitespace-nowrap !rounded-button"
              onClick={handleClick}
            >
              Đăng ký học
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard; 