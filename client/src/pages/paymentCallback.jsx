import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const query = window.location.search;
      const response = await fetch(`http://localhost:5000/api/vnpay/verify${query}`);
      const data = await response.json();
      if (data.success) {
        navigate(`/order-success/${data.orderId}`);
      } else {
        alert('Thanh toán thất bại!');
        navigate('/cart');
      }
    };

    verifyPayment();
  }, []);

  return <p>Đang xác minh kết quả thanh toán...</p>;
};

export default PaymentCallback;
