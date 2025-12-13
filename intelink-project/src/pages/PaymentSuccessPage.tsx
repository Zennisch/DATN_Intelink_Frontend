import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-green-600 text-2xl font-bold mb-4">Thanh toán thành công!</div>
      <div className="mb-6">Cảm ơn bạn đã thanh toán. Gói dịch vụ của bạn đã được kích hoạt.</div>
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate('/')}
      >
        Quay về trang chủ
      </button>
    </div>
  );
};

export default PaymentSuccessPage;
