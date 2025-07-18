import React, { useState } from "react";

function BasicCourse() {
  const [course] = useState({
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    popular: true,
    level: "Cơ bản",
    age: "4-7 tuổi",
    title: "Tiếng Anh cơ bản cho trẻ em",
    description: "Khóa học giúp xây dựng nền tảng tiếng Anh vững chắc thông qua các hoạt động tương tác.",
    weeks: 8,
    lessons: 16,
    teacherName: "Nguyễn Thị Hương",
    teacherRole: "Giáo viên chính",
    price: "500.000đ",
    teacherAvatar: "https://readdy.ai/api/search-image?query=professional%20female%20teacher%20portrait%2C%20warm%20smile%2C%20simple%20background&width=32&height=32&seq=teacher1&orientation=squarish"
  });

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-0 max-w-sm mx-auto">
      <div className="relative">
        <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
        {course.popular && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium">
            Phổ biến
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2 space-x-2">
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{course.level}</div>
          <div className="text-sm text-gray-600">{course.age}</div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-1">🗓️</span>
            <span className="text-sm text-gray-600">{course.weeks} tuần học</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm mr-1">📚</span>
            <span className="text-sm text-gray-600">{course.lessons} bài học</span>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <img
            src={course.teacherAvatar}
            className="w-8 h-8 rounded-full border-2 border-white mr-2"
            alt={course.teacherName}
          />
          <div>
            <p className="text-sm font-medium text-gray-800">{course.teacherName}</p>
            <p className="text-xs text-gray-600">{course.teacherRole}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{course.price}</span>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-button font-medium whitespace-nowrap !rounded-button">
            Đăng ký học
          </button>
        </div>
      </div>
    </div>
  );
}

export default BasicCourse; 