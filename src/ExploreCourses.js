import React from "react";

function ExploreCourses() {
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
                {["4-7 tuổi", "8-10 tuổi"].map((age, idx) => (
                  <label className="flex items-center" key={age}>
                    <input type="checkbox" className="hidden" name="age" value={age} />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center mr-3 transition-colors">
                      <i className="ri-check-line text-white text-sm hidden"></i>
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
                {["Cơ bản", "Trung cấp", "Nâng cao"].map((level, idx) => (
                  <label className="flex items-center" key={level}>
                    <input type="checkbox" className="hidden" name="level" value={level} />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center mr-3 transition-colors">
                      <i className="ri-check-line text-white text-sm hidden"></i>
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
                {["Nói", "Nghe", "Đọc", "Viết"].map((skill, idx) => (
                  <label className="flex items-center" key={skill}>
                    <input type="checkbox" className="hidden" name="skill" value={skill} />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center mr-3 transition-colors">
                      <i className="ri-check-line text-white text-sm hidden"></i>
                    </div>
                    <span className="text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Price filter */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Giá</h3>
              <div className="relative mb-6">
                <input type="range" min="0" max="5000000" defaultValue="2500000" className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer" />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">0đ</span>
                  <span className="text-sm text-gray-600">5.000.000đ</span>
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
            {/* Course Card 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img src="https://readdy.ai/api/search-image?query=children%20learning%20English%20alphabet%20with%20interactive%20digital%20screen%2C%20colorful%20educational%20setting%2C%20modern%20classroom%2C%20simple%20background%2C%20clean%20design&width=400&height=250&seq=course1&orientation=landscape" alt="Basic English Course" className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium">Phổ biến</div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Cơ bản</div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full mx-2"></div>
                  <div className="text-sm text-gray-600">4-7 tuổi</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Tiếng Anh cơ bản cho trẻ em</h3>
                <p className="text-gray-600 text-sm mb-4">Khóa học giúp xây dựng nền tảng tiếng Anh vững chắc thông qua các hoạt động tương tác.</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full mr-2">
                      <i className="ri-time-line text-primary"></i>
                    </div>
                    <span className="text-sm text-gray-600">12 tuần học</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full mr-2">
                      <i className="ri-book-open-line text-green-600"></i>
                    </div>
                    <span className="text-sm text-gray-600">24 bài học</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img src="https://readdy.ai/api/search-image?query=professional%20female%20teacher%20portrait%2C%20warm%20smile%2C%20simple%20background&width=32&height=32&seq=teacher1&orientation=squarish" className="w-8 h-8 rounded-full border-2 border-white mr-2" alt="Teacher" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Nguyễn Thị Hương</p>
                      <p className="text-xs text-gray-600">Giáo viên chính</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">2.400.000đ</span>
                  <button className="px-4 py-2 bg-primary text-white rounded-button font-medium whitespace-nowrap !rounded-button">Đăng ký học</button>
                </div>
              </div>
            </div>
            {/* Course Card 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img src="https://readdy.ai/api/search-image?query=children%20practicing%20English%20conversation%20in%20pairs%2C%20modern%20classroom%20setting%2C%20interactive%20learning%2C%20simple%20background%2C%20clean%20design&width=400&height=250&seq=course2&orientation=landscape" alt="Speaking Course" className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Mới</div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Trung cấp</div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full mx-2"></div>
                  <div className="text-sm text-gray-600">8-10 tuổi</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Giao tiếp tiếng Anh</h3>
                <p className="text-gray-600 text-sm mb-4">Phát triển kỹ năng giao tiếp tự tin thông qua các hoạt động thực tế.</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full mr-2">
                      <i className="ri-time-line text-primary"></i>
                    </div>
                    <span className="text-sm text-gray-600">8 tuần học</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full mr-2">
                      <i className="ri-book-open-line text-green-600"></i>
                    </div>
                    <span className="text-sm text-gray-600">16 bài học</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img src="https://readdy.ai/api/search-image?query=professional%20male%20teacher%20portrait%2C%20friendly%20smile%2C%20simple%20background&width=32&height=32&seq=teacher2&orientation=squarish" className="w-8 h-8 rounded-full border-2 border-white mr-2" alt="Teacher" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Trần Văn Minh</p>
                      <p className="text-xs text-gray-600">Giáo viên chính</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">1.800.000đ</span>
                  <button className="px-4 py-2 bg-primary text-white rounded-button font-medium whitespace-nowrap !rounded-button">Đăng ký học</button>
                </div>
              </div>
            </div>
            {/* Course Card 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img src="https://readdy.ai/api/search-image?query=children%20learning%20English%20through%20educational%20games%20on%20tablets%2C%20modern%20classroom%2C%20interactive%20learning%2C%20simple%20background%2C%20clean%20design&width=400&height=250&seq=course3&orientation=landscape" alt="Interactive Course" className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Nâng cao</div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Nâng cao</div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full mx-2"></div>
                  <div className="text-sm text-gray-600">11-13 tuổi</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Tiếng Anh tương tác</h3>
                <p className="text-gray-600 text-sm mb-4">Học tiếng Anh qua các trò chơi và hoạt động tương tác.</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full mr-2">
                      <i className="ri-time-line text-primary"></i>
                    </div>
                    <span className="text-sm text-gray-600">10 tuần học</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full mr-2">
                      <i className="ri-book-open-line text-green-600"></i>
                    </div>
                    <span className="text-sm text-gray-600">20 bài học</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img src="https://readdy.ai/api/search-image?query=professional%20female%20teacher%20portrait%2C%20warm%20smile%2C%20simple%20background&width=32&height=32&seq=teacher3&orientation=squarish" className="w-8 h-8 rounded-full border-2 border-white mr-2" alt="Teacher" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Phạm Thu Thảo</p>
                      <p className="text-xs text-gray-600">Giáo viên chính</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">2.200.000đ</span>
                  <button className="px-4 py-2 bg-primary text-white rounded-button font-medium whitespace-nowrap !rounded-button">Đăng ký học</button>
                </div>
              </div>
            </div>
          </div>
          {/* Pagination */}
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
