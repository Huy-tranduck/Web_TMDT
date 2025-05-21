import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [orderStats, setOrderStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // Fetch tổng quan dashboard
                const dashboardResponse = await fetch('http://localhost:5000/api/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                // Fetch chi tiết đơn hàng
                const orderResponse = await fetch('http://localhost:5000/api/admin/orders/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!dashboardResponse.ok || !orderResponse.ok) {
                    throw new Error('Lỗi khi tải dữ liệu thống kê');
                }

                const [dashboardData, orderData] = await Promise.all([
                    dashboardResponse.json(),
                    orderResponse.json()
                ]);

                setDashboardStats(dashboardData);
                setOrderStats(orderData.data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!dashboardStats || !orderStats) return null;

    return (
        <div className={styles.dashboard}>
            <div className={styles.statsGrid}>
                {/* Thống kê tổng quan */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <i className="fas fa-users"></i>
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Tổng người dùng</h3>
                        <p>{dashboardStats.totalUsers}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Tổng đơn hàng</h3>
                        <p>{orderStats.totalOrders}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Doanh thu</h3>
                        <p>{orderStats.totalRevenue.toLocaleString('vi-VN')}₫</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Đơn chờ xử lý</h3>
                        <p>{orderStats.ordersByStatus.pending}</p>
                    </div>
                </div>
            </div>

            {/* Thống kê đơn hàng theo trạng thái */}
            <div className={styles.orderStatusGrid}>
                <div className={styles.statusCard}>
                    <h4>Chờ xác nhận</h4>
                    <p>{orderStats.ordersByStatus.pending}</p>
                </div>
                <div className={styles.statusCard}>
                    <h4>Đã xác nhận</h4>
                    <p>{orderStats.ordersByStatus.confirmed}</p>
                </div>
                <div className={styles.statusCard}>
                    <h4>Đang giao</h4>
                    <p>{orderStats.ordersByStatus.shipping}</p>
                </div>
                <div className={styles.statusCard}>
                    <h4>Đã giao</h4>
                    <p>{orderStats.ordersByStatus.delivered}</p>
                </div>
                <div className={styles.statusCard}>
                    <h4>Đã hủy</h4>
                    <p>{orderStats.ordersByStatus.cancelled}</p>
                </div>
            </div>

            {/* Đơn hàng gần đây */}
            <div className={styles.recentOrders}>
                <h2>Đơn hàng gần đây</h2>
                <table>
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
                                        {order.status === 'pending' && 'Chờ xác nhận'}
                                        {order.status === 'confirmed' && 'Đã xác nhận'}
                                        {order.status === 'shipping' && 'Đang giao'}
                                        {order.status === 'delivered' && 'Đã giao'}
                                        {order.status === 'cancelled' && 'Đã hủy'}
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
