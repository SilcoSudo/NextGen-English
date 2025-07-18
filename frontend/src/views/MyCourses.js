import React from "react";
import { useNavigate } from "react-router-dom";
import mockCourses from "./mockCourses";

function MyCourses() {
  const navigate = useNavigate();
  // Giả lập các khóa học đã mua (có thể lấy từ mockCourses hoặc filter theo id)
  const purchasedCourses = mockCourses.slice(0, 4); // Lấy 4 khóa đầu làm ví dụ

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Các khóa học đã mua</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {purchasedCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="flex items-center mb-4">
                <img src={course.teacherAvatar} className="w-8 h-8 rounded-full border-2 border-white mr-2" alt="Teacher" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{course.teacherName}</p>
                  <p className="text-xs text-gray-600">{course.teacherRole}</p>
                </div>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-button font-medium whitespace-nowrap !rounded-button"
                onClick={() => navigate(`/courses/${course.id}/learn`)}
              >
                Bắt đầu học
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default MyCourses; 