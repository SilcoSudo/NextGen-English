import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function PaymentFailure() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const orderId = searchParams.get('orderId');
        const resultCode = searchParams.get('resultCode');
        const message = searchParams.get('message');

        console.log('Payment failure params:', { orderId, resultCode, message });

        if (orderId) {
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
          }
        }

        // Set error message based on result code
        if (resultCode) {
          switch (resultCode) {
            case '1001':
              setError('Giao dịch đã bị hủy bởi người dùng');
              break;
            case '1002':
              setError('Giao dịch thất bại do lỗi kỹ thuật');
              break;
            case '1003':
              setError('Giao dịch bị từ chối bởi ngân hàng');
              break;
            case '1004':
              setError('Thẻ/tài khoản không đủ số dư');
              break;
            case '1005':
              setError('Thời gian giao dịch đã hết hạn');
              break;
            case '1006':
              setError('Lỗi xác thực OTP');
              break;
            default:
              setError(message || 'Thanh toán thất bại');
          }
        } else {
          setError('Thanh toán đã bị hủy');
        }
      } catch (err) {
        console.error('Check payment status error:', err);
        setError('Không thể kiểm tra trạng thái thanh toán');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Đang kiểm tra...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-6 md:py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
          {/* Failure Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-close-line text-4xl text-red-600"></i>
          </div>

          {/* Failure Message */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Thanh toán thất bại 😔
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'Có lỗi xảy ra trong quá trình thanh toán'}
          </p>

          {/* Payment Details */}
          {paymentInfo && (
            <div className="bg-red-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-3">Thông tin đơn hàng</h3>
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
                  <span className="font-medium text-red-600">
                    {paymentInfo.amount?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
            >
              <i className="ri-refresh-line mr-2"></i>
              Thử thanh toán lại
            </button>

            <button
              onClick={() => navigate('/my-lessons')}
              className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
            >
              <i className="ri-book-open-line mr-2"></i>
              Quay lại khóa học của tôi
            </button>

            <button
              onClick={() => navigate('/lessons')}
              className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
            >
              <i className="ri-search-line mr-2"></i>
              Khám phá khóa học khác
            </button>
          </div>

          {/* Help Info */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start">
              <i className="ri-question-line text-yellow-600 mt-1 mr-2"></i>
              <div className="text-sm text-yellow-800 text-left">
                <p className="font-medium mb-1">Cần hỗ trợ?</p>
                <p>Nếu bạn gặp vấn đề với thanh toán, vui lòng liên hệ bộ phận hỗ trợ của chúng tôi để được giải quyết nhanh chóng.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;