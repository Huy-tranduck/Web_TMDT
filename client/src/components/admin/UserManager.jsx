import React, { useState, useEffect } from 'react';
import styles from './UserManager.module.css';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      fetchUsers(); // Refresh data sau khi cập nhật trạng thái
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/users', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                role: 'user'
            })
        });

        const data = await response.json();

        if (response.ok) {
            await fetchUsers();
            setShowAddForm(false);
            setNewUser({
                username: '',
                email: '',
                password: '',
                role: 'user'
            });
            showNotification('Thêm người dùng thành công', 'success');
        } else {
            throw new Error(data.message || 'Lỗi khi thêm người dùng');
        }
    } catch (error) {
        console.error('Add user error:', error);
        showNotification(error.message || 'Lỗi khi thêm người dùng', 'error');
    }
};

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingUser)
      });

      const data = await response.json();

      if (response.ok) {
        fetchUsers();
        setShowEditForm(false);
        setEditingUser(null);
        showNotification('Cập nhật thông tin thành công', 'success');
      } else {
        throw new Error(data.message || 'Lỗi khi cập nhật thông tin');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleResetPassword = async (userId) => {
    if (window.confirm('Xác nhận đặt lại mật khẩu cho người dùng này?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/reset-password`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          showNotification('Đặt lại mật khẩu thành công. Mật khẩu mới là: 123456', 'success');
        } else {
          throw new Error(data.message || 'Lỗi khi đặt lại mật khẩu');
        }
      } catch (error) {
        showNotification(error.message, 'error');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Xác nhận xóa người dùng này? Hành động này không thể hoàn tác.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchUsers();
          showNotification('Xóa người dùng thành công', 'success');
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Lỗi khi xóa người dùng');
        }
      } catch (error) {
        showNotification(error.message, 'error');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.userManager}>
      <div className={styles.header}>
        <h2>Quản lý người dùng</h2>
        <button
          className={styles.addButton}
          onClick={() => setShowAddForm(true)}
        >
          <i className="fas fa-plus"></i> Thêm người dùng
        </button>
      </div>

      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      {/* Form thêm người dùng */}
      {showAddForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Thêm người dùng mới</h3>
            <form onSubmit={handleAddUser}>
              <div className={styles.formGroup}>
                <label>Tên đăng nhập</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mật khẩu</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowAddForm(false)}>Hủy</button>
                <button type="submit">Thêm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form chỉnh sửa người dùng */}
      {showEditForm && editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Chỉnh sửa thông tin người dùng</h3>
            <form onSubmit={handleEditUser}>
              <div className={styles.formGroup}>
                <label>Tên đăng nhập</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowEditForm(false)}>Hủy</button>
                <button type="submit">Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>{user.isActive ? 'Hoạt động' : 'Đã khóa'}</td>
              <td>
                <button 
                  className={styles.editButton}
                  onClick={() => {
                    setEditingUser(user);
                    setShowEditForm(true);
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  className={styles.resetButton}
                  onClick={() => handleResetPassword(user._id)}
                >
                  <i className="fas fa-key"></i>
                </button>
                <button
                  className={user.isActive ? styles.blockButton : styles.unblockButton}
                  onClick={() => toggleUserStatus(user._id, !user.isActive)}
                >
                  <i className={`fas fa-${user.isActive ? 'lock' : 'unlock'}`}></i>
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDeleteUser(user._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
