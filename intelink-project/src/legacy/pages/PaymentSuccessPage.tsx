import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 lg:p-12 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-100 mb-4 md:mb-6">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600 mb-3 md:mb-4">
          Thanh toán thành công!
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
          Cảm ơn bạn đã thanh toán. Gói dịch vụ của bạn đã được kích hoạt.
        </p>
        
        <div className="space-y-3">
          <button
            className="w-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={() => navigate('/dashboard')}
          >
            Đi đến Dashboard
          </button>
          <button
            className="w-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            onClick={() => navigate('/plans')}
          >
            Xem các gói khác
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
