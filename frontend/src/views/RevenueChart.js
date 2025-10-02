import React, { useState } from 'react';
import { useAuth } from '../models/AuthContext';
import AdminLayout from './admin/AdminLayout';
import { revenueData, adminStats, formatPrice, formatNumber } from '../data/adminData';

function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { user } = useAuth();

  // Sử dụng dữ liệu chung từ adminData
  const chartData = {
    month: {
      labels: revenueData.monthly.map(item => item.month),
      data: revenueData.monthly.map(item => item.revenue)
    },
    week: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      data: [850000, 920000, 1100000, 1250000, 1350000, 1200000, 980000]
    },
    day: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      data: [150000, 80000, 250000, 450000, 380000, 320000]
    }
  };

  const currentData = chartData[selectedPeriod];

  const getTotalRevenue = () => {
    return currentData.data.reduce((sum, value) => sum + value, 0);
  };

  const getAverageRevenue = () => {
    return getTotalRevenue() / currentData.data.length;
  };

  const getGrowthRate = () => {
    if (currentData.data.length < 2) return 0;
    const current = currentData.data[currentData.data.length - 1];
    const previous = currentData.data[currentData.data.length - 2];
    return ((current - previous) / previous) * 100;
  };

  const getMaxRevenue = () => {
    return Math.max(...currentData.data);
  };

  const getMinRevenue = () => {
    return Math.min(...currentData.data);
  };

  // Simple bar chart using CSS - sửa lỗi tràn
  const renderBarChart = () => {
    const maxValue = Math.max(...currentData.data);
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Biểu đồ doanh thu</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPeriod('day')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedPeriod === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ngày
            </button>
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedPeriod === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedPeriod === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tháng
            </button>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2 overflow-hidden">
          {currentData.data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center min-w-0">
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                style={{ 
                  height: `${(value / maxValue) * 200}px`,
                  minHeight: '4px'
                }}
              ></div>
              <div className="mt-2 text-xs text-gray-600 text-center truncate w-full">
                {currentData.labels[index]}
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center truncate w-full">
                {formatPrice(value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Biểu đồ doanh thu</h1>
          <p className="text-gray-600">Theo dõi doanh thu và hiệu suất kinh doanh</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="ri-money-dollar-circle-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(getTotalRevenue())}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="ri-trending-up-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tăng trưởng</p>
                <p className={`text-2xl font-bold ${getGrowthRate() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {getGrowthRate() >= 0 ? '+' : ''}{getGrowthRate().toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="ri-bar-chart-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trung bình</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(getAverageRevenue())}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <i className="ri-arrow-up-line text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cao nhất</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(getMaxRevenue())}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            {renderBarChart()}
          </div>

          {/* Revenue Details */}
          <div className="space-y-6">
            {/* Revenue by Category */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo danh mục</h3>
              <div className="space-y-4">
                {revenueData.byCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-sm text-gray-700">{item.category}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatPrice(item.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Courses */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Khóa học bán chạy</h3>
              <div className="space-y-4">
                {revenueData.topCourses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{course.name}</p>
                      <p className="text-xs text-gray-500">{formatNumber(course.students)} học viên</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium text-blue-600">{formatPrice(course.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt doanh thu</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Thấp nhất:</span>
                  <span className="text-sm font-medium text-gray-900">{formatPrice(getMinRevenue())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cao nhất:</span>
                  <span className="text-sm font-medium text-gray-900">{formatPrice(getMaxRevenue())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Chênh lệch:</span>
                  <span className="text-sm font-medium text-gray-900">{formatPrice(getMaxRevenue() - getMinRevenue())}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">Tổng cộng:</span>
                  <span className="text-sm font-medium text-gray-900">{formatPrice(getTotalRevenue())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default RevenueChart; 