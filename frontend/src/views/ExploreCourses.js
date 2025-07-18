import React, { useState, useMemo } from "react";
import CourseCard from "./CourseCard";
import mockCourses from "./mockCourses";

const ageOptions = ["4-7 tuổi", "8-10 tuổi"];
const levelOptions = ["Cơ bản", "Trung cấp", "Nâng cao"];
const skillOptions = ["Nói", "Nghe", "Đọc", "Viết"];

function ExploreCourses() {
  const [selectedAges, setSelectedAges] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Lọc khóa học dựa trên filter
  const filteredCourses = useMemo(() => {
    return mockCourses.filter(course => {
      // Lọc theo độ tuổi
      if (selectedAges.length > 0 && !selectedAges.includes(course.age)) return false;
      // Lọc theo trình độ
      if (selectedLevels.length > 0 && !selectedLevels.includes(course.level)) return false;
      // Lọc theo kỹ năng
      if (selectedSkills.length > 0 && !selectedSkills.some(skill => course.skills.includes(skill))) return false;
      return true;
    });
  }, [selectedAges, selectedLevels, selectedSkills]);

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

  return (
    <main className="container mx-auto px-4 pt-24 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Khám phá khóa học</h1>
          <p className="text-gray-600">Tìm kiếm khóa học phù hợp với độ tuổi và trình độ của bạn</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button id="sortButton" className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-button text-sm font-medium text-gray-700 bg-white hover:border-primary transition-colors whitespace-nowrap !rounded-button">
              <i className="ri-sort-desc"></i>
              <span>Sắp xếp theo</span>
            </button>
            {/* Dropdown sort menu (ẩn/hiện bằng JS, có thể làm sau) */}
            <div id="sortDropdown" className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Mới nhất</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Phổ biến nhất</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Giá thấp đến cao</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Giá cao đến thấp</a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-primary transition-colors whitespace-nowrap !rounded-button">
              <i className="ri-grid-fill"></i>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-primary transition-colors whitespace-nowrap !rounded-button">
              <i className="ri-list-check"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="col-span-3">
          <div className="bg-white rounded-lg p-6 sticky top-24">
            {/* Age filter */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Độ tuổi</h3>
              <div className="space-y-3">
                {ageOptions.map((age) => (
                  <label className="flex items-center" key={age}>
                    <input
                      type="checkbox"
                      className="hidden"
                      name="age"
                      value={age}
                      checked={selectedAges.includes(age)}
                      onChange={() => handleFilterChange('age', age)}
                    />
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 transition-colors ${selectedAges.includes(age) ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}>
                      <i className={`ri-check-line text-white text-sm ${selectedAges.includes(age) ? '' : 'hidden'}`}></i>
                    </div>
                    <span className="text-gray-700">{age}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Level filter */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Trình độ</h3>
              <div className="space-y-3">
                {levelOptions.map((level) => (
                  <label className="flex items-center" key={level}>
                    <input
                      type="checkbox"
                      className="hidden"
                      name="level"
                      value={level}
                      checked={selectedLevels.includes(level)}
                      onChange={() => handleFilterChange('level', level)}
                    />
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 transition-colors ${selectedLevels.includes(level) ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}>
                      <i className={`ri-check-line text-white text-sm ${selectedLevels.includes(level) ? '' : 'hidden'}`}></i>
                    </div>
                    <span className="text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Skill filter */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Kỹ năng</h3>
              <div className="space-y-3">
                {skillOptions.map((skill) => (
                  <label className="flex items-center" key={skill}>
                    <input
                      type="checkbox"
                      className="hidden"
                      name="skill"
                      value={skill}
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleFilterChange('skill', skill)}
                    />
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 transition-colors ${selectedSkills.includes(skill) ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}>
                      <i className={`ri-check-line text-white text-sm ${selectedSkills.includes(skill) ? '' : 'hidden'}`}></i>
                    </div>
                    <span className="text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Price filter giữ nguyên */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Giá</h3>
              <div className="relative mb-6">
                <input type="range" min="0" max="5000000" defaultValue="2500000" className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer" />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">0đ</span>
                  <span className="text-sm text-gray-600">500.000đ</span>
                </div>
              </div>
              <button className="w-full py-2.5 bg-primary text-white rounded-button font-medium whitespace-nowrap !rounded-button">
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </aside>
        {/* Course list */}
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          {/* Pagination giữ nguyên */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hiển thị</span>
              <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 pr-8">
                <option>9</option>
                <option>12</option>
                <option>15</option>
              </select>
              <span className="text-sm text-gray-600">trên trang</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap !rounded-button" disabled>
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white whitespace-nowrap !rounded-button">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-colors whitespace-nowrap !rounded-button">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-colors whitespace-nowrap !rounded-button">3</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-colors whitespace-nowrap !rounded-button">
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ExploreCourses;
