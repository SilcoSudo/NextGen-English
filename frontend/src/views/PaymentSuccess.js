import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('orderId');
        const resultCode = searchParams.get('resultCode');
        const transId = searchParams.get('transId');

        console.log('Payment callback params:', { orderId, resultCode, transId });

        if (!orderId) {
          setError('Thiếu thông tin đơn hàng');
          setLoading(false);
          return;
        }

        // Kiểm tra trạng thái thanh toán
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${window.location.origin}/api/payment/status/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setPaymentInfo(data.data);
        } else {
          setError(data.message || 'Không thể xác minh thanh toán');
        }
      } catch (err) {
        console.error('Verify payment error:', err);
        setError('Lỗi xác minh thanh toán');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Đang xác minh thanh toán...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-3xl text-red-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thất bại</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/my-lessons')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại khóa học
            </button>
            <button
              onClick={() => navigate('/lessons')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Khám phá khóa học khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-6 md:py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-4xl text-green-600"></i>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Thanh toán thành công! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Chúc mừng! Bạn đã thanh toán thành công cho khóa học.
          </p>

          {/* Payment Details */}
          {paymentInfo && (
            <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-3">Chi tiết thanh toán</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">{paymentInfo.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Khóa học:</span>
                  <span className="font-medium">{paymentInfo.lesson?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-green-600">
                    {paymentInfo.amount?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">
                    {paymentInfo.paidAt ? new Date(paymentInfo.paidAt).toLocaleString('vi-VN') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/my-lessons')}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
            >
              <i className="ri-play-circle-line mr-2"></i>
              Bắt đầu học ngay
            </button>

            <button
              onClick={() => navigate('/lessons')}
              className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
            >
              <i className="ri-search-line mr-2"></i>
              Khám phá khóa học khác
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <i className="ri-information-line text-blue-600 mt-1 mr-2"></i>
              <div className="text-sm text-blue-800 text-left">
                <p className="font-medium mb-1">Lưu ý quan trọng</p>
                <p>Khóa học của bạn đã được kích hoạt và có thể truy cập bất cứ lúc nào. Email xác nhận đã được gửi đến địa chỉ email của bạn.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;