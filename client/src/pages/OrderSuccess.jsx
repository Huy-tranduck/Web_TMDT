import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './OrderSuccess.module.css';
import Header from '../components/common/Header';

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <>
      <Header />
      <div className={styles.successContainer}>
        <div className={styles.successContent}>
          <i className="fa fa-check-circle"></i>
          <h1>Đặt hàng thành công!</h1>
          <p>Mã đơn hàng của bạn: {orderId}</p>
          <p>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.</p>
          <div className={styles.buttons}>
            <Link to="/" className={styles.continueBtn}>
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
