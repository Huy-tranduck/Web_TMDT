import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [orderStats, setOrderStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderStats = async () => {
            try {
                const token = localStorage.getItem('token');
                // Sửa lại endpoint URL
                const response = await fetch('http://localhost:5000/api/admin/orders/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch order statistics');
                }

                const data = await response.json();
                if (data.success) {
                    setOrderStats(data.data);
                } else {
                    throw new Error(data.message || 'Failed to fetch order statistics');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrderStats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!orderStats) return null;

    return (
        <div className={styles.dashboard}>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Tổng số đơn hàng</h3>
                    <p>{orderStats.totalOrders}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Doanh thu</h3>
                    <p>{orderStats.totalRevenue.toLocaleString('vi-VN')}₫</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Đơn hàng chờ xử lý</h3>
                    <p>{orderStats.ordersByStatus.pending}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Đơn hàng đã giao</h3>
                    <p>{orderStats.ordersByStatus.delivered}</p>
                </div>
            </div>

            {/* Hiển thị đơn hàng gần đây */}
            <div className={styles.recentOrders}>
                <h2>Đơn hàng gần đây</h2>
                <table className={styles.orderTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Khách hàng</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Ngày đặt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderStats.recentOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customerName}</td>
                                <td>{order.totalAmount.toLocaleString('vi-VN')}₫</td>
                                <td>
                                    <span className={styles[order.status]}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
