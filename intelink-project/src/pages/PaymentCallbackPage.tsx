import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse query params from URL
    const searchParams = new URLSearchParams(location.search);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Call backend callback API
    axios.post('/payment/vnpay/callback', params)
      .then((res) => {
        if (res.status === 200) {
          navigate('/payments/payment-success');
        } else {
          setError('Thanh toán thất bại.');
        }
      })
      .catch(() => {
        setError('Thanh toán thất bại.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.search, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Đang xác nhận thanh toán...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return null;
};

export default PaymentCallbackPage;
