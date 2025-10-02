// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../models/AuthContext';
import AdminLayout from './AdminLayout';
import { adminStats, courseData, recentActivities, formatPrice, formatNumber } from '../../data/adminData';

function AdminHome() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { title: 'Tổng học viên', value: formatNumber(adminStats.totalStudents), change: adminStats.studentChange, icon: 'ri-user-line', color: 'blue' },
    { title: 'Khóa học hoạt động', value: adminStats.activeCourses.toString(), change: adminStats.courseChange, icon: 'ri-book-open-line', color: 'green' },
    { title: 'Doanh thu tháng', value: formatPrice(adminStats.monthlyRevenue), change: adminStats.revenueChange, icon: 'ri-line-chart-line', color: 'purple' },
    { title: 'Tỷ lệ hoàn thành', value: adminStats.completionRate + '%', change: adminStats.completionChange, icon: 'ri-medal-line', color: 'orange' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                  <i className={`${stat.icon} text-${stat.color}-600 text-xl`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg cursor-pointer whitespace-nowrap">
                  7 ngày
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer whitespace-nowrap">
                  30 ngày
                </button>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <i className="ri-line-chart-line text-3xl mb-2"></i>
                <p>Biểu đồ doanh thu</p>
              </div>
            </div>
          </div>

          {/* Top Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Khóa học phổ biến</h3>
            <div className="space-y-4">
              {courseData.filter(course => course.status === 'active').slice(0, 4).map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-500">{formatNumber(course.students)} học viên</p>
                  </div>
                  <div className="w-16 text-right">
                    <div className="text-sm font-medium text-gray-900">{course.progress}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer whitespace-nowrap">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {activity.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium text-blue-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <div className="text-gray-400">
                  <i className="ri-arrow-right-s-line text-sm"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col space-y-3">
            <button className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full shadow-lg text-white transition-all duration-200 transform hover:scale-110 cursor-pointer">
              <i className="ri-add-line text-lg"></i>
            </button>
            <button className="bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg text-white transition-all duration-200 transform hover:scale-110 cursor-pointer">
              <i className="ri-message-3-line text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminHome;
