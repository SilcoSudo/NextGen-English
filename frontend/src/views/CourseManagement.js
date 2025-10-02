import React, { useState } from 'react';
import { useAuth } from '../models/AuthContext';
import AdminLayout from './admin/AdminLayout';
import { courseData, adminStats, formatPrice, formatNumber } from '../data/adminData';

function CourseManagement() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Sử dụng dữ liệu chung từ adminData
  const [courses, setCourses] = useState(courseData);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };

  const handleStatusToggle = (courseId) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, status: course.status === 'active' ? 'draft' : 'active' }
        : course
    ));
  };

  // Sử dụng formatPrice từ adminData

  const getCategoryIcon = (category) => {
    const icons = {
      'Speaking': 'ri-mic-line',
      'Listening': 'ri-headphone-line',
      'Reading': 'ri-book-open-line',
      'Writing': 'ri-edit-line',
      'Grammar': 'ri-file-text-line'
    };
    return icons[category] || 'ri-book-line';
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khóa học</h1>
          <p className="text-gray-600">Quản lý tất cả khóa học trong hệ thống</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="ri-book-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng khóa học</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="ri-check-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{courses.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="ri-user-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng học viên</p>
                <p className="text-2xl font-bold text-gray-900">{courses.reduce((sum, c) => sum + c.students, 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <i className="ri-money-dollar-circle-line text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(adminStats.monthlyRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="Speaking">Speaking</option>
                  <option value="Listening">Listening</option>
                  <option value="Reading">Reading</option>
                  <option value="Writing">Writing</option>
                  <option value="Grammar">Grammar</option>
                </select>
                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
              {/* Add Course Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <i className="ri-add-line mr-2"></i>
                Thêm khóa học
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Course Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    course.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'active' ? 'Hoạt động' : 'Bản nháp'}
                  </span>
                </div>
                {/* Label Badge */}
                {course.label && (
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.labelColor || 'bg-yellow-400 text-white'}`}>
                      {course.label}
                    </span>
                  </div>
                )}
                {/* Level Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.levelColor || 'bg-blue-100 text-blue-700'}`}>
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                {/* Category */}
                <div className="flex items-center mb-2">
                  <i className={`${getCategoryIcon(course.category)} text-blue-600 mr-2`}></i>
                  <span className="text-sm text-gray-600">{course.category}</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full mx-2"></div>
                  <div className="text-sm text-gray-600">{course.age}</div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                {/* Course Stats */}
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

                {/* Teacher Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img src={course.teacherAvatar} className="w-8 h-8 rounded-full border-2 border-white mr-2" alt="Teacher" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{course.teacherName}</p>
                      <p className="text-xs text-gray-600">{course.teacherRole}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary">{formatPrice(course.price)}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStatusToggle(course.id)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        course.status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {course.status === 'active' ? 'Vô hiệu' : 'Kích hoạt'}
                    </button>
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded text-xs font-medium bg-blue-100 hover:bg-blue-200"
                    >
                      Sửa
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-900 px-3 py-1 rounded text-xs font-medium bg-red-100 hover:bg-red-200"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khóa học</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default CourseManagement; 