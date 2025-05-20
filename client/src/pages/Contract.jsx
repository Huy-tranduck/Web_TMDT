import React, { useState } from 'react';
import Header from '../components/common/Header';
import styles from './Contract.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    title: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý form (có thể gửi API hoặc chỉ hiển thị thông báo)
    alert('Thông tin liên hệ của bạn đã được gửi!');
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      title: '',
      content: ''
    });
  };

  return (
    <>
      <Header />
      <section className={styles.bodyLienhe}>
        <div className={styles.lienheHeader}>Liên hệ</div>
        <div className={styles.lienheInfo}>
          <div className={styles.infoLeft}>
            <h2 className={styles.companyName}>CÔNG TY CỔ PHẦN H - GROUP</h2>
            <p>
              <b>Địa chỉ:</b> 273 An Dương Vương, phường 3, Quận 5, TPHCM<br /><br />
              <b>Telephone:</b> 028 3835 4409<br /><br />
              <b>Hotline:</b> 097777777 - CSKH: 028 9996 777<br /><br />
              <b>Website:</b> <a href="https://github.com/HoangTran0410/DoAn_Web1">Github</a> <br /><br />
              <b>E-mail:</b> DoAn@gmail.com<br /><br />
              <b>Mã số thuế:</b> 01 02 03 04 05<br /><br />
              <b>Tài khoản ngân hàng:</b><br /><br />
              <b>Số TK:</b> 060008086888 <br /><br />
              <b>Tại Ngân hàng:</b> Agribank Chi nhánh Sài Gòn<br /><br /><br />
              <b>Quý khách có thể gửi liên hệ tới chúng tôi bằng cách hoàn tất biểu mẫu dưới đây. Chúng tôi
                sẽ trả lời thư của quý khách, xin vui lòng khai báo đầy đủ. Hân hạnh phục vụ và chân thành
                cảm ơn sự quan tâm, đóng góp ý kiến đến Smartphone Store.</b>
            </p>
          </div>
          <div className={styles.infoRight}>
            <iframe 
              width="100%" 
              height="450" 
              src="https://maps.google.com/maps?width=100%&amp;height=450&amp;hl=en&amp;coord=10.759660000323064,106.68192160315813&amp;q=273%20An%20D%C6%B0%C6%A1ng%20V%C6%B0%C6%A1ng%20Ph%C6%B0%E1%BB%9Dng%203%20Qu%E1%BA%ADn%205%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vi%E1%BB%87t%20Nam+(My%20Business%20Name)&amp;ie=UTF8&amp;t=&amp;z=16&amp;iwloc=B&amp;output=embed"
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0"
              title="Bản đồ địa chỉ công ty"
            />
          </div>
        </div>
        <div className={styles.lienheInfo}>
          <div className={styles.guiThongTin}>
            <p className={styles.formTitle}>Gửi thông tin liên lạc cho chúng tôi: </p>
            <hr />
            <form onSubmit={handleSubmit}>
              <table cellSpacing="10px">
                <tbody>
                  <tr>
                    <td>Họ và tên</td>
                    <td>
                      <input 
                        type="text" 
                        name="name" 
                        size="40" 
                        maxLength="40" 
                        placeholder="Họ tên"
                        autoComplete="off" 
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Điện thoại liên hệ</td>
                    <td>
                      <input 
                        type="text" 
                        name="phone" 
                        size="40" 
                        maxLength="11" 
                        minLength="10" 
                        placeholder="Điện thoại"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Địa chỉ Email</td>
                    <td>
                      <input 
                        type="email" 
                        name="email" 
                        size="40" 
                        placeholder="Email" 
                        autoComplete="off"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Tiêu đề</td>
                    <td>
                      <input 
                        type="text" 
                        name="title" 
                        size="40" 
                        maxLength="100" 
                        placeholder="Tiêu đề"
                        required
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Nội dung</td>
                    <td>
                      <textarea 
                        name="content" 
                        rows="5" 
                        cols="44" 
                        maxLength="500" 
                        placeholder="Nội dung liên hệ" 
                        required
                        value={formData.content}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <button type="submit">Gửi thông tin liên hệ</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
          <div className={styles.thongTinNhom}>
            <p className={styles.formTitle}>Thông tin thành viên nhóm: </p>
            <hr />
            <table>
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>MSSV</th>
                  <th>Giới tính</th>
                  <th>Lớp</th>
                  <th>Tỉ lệ công việc</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Trần Văn Hoàng</td>
                  <td>3117410091</td>
                  <td>Nam</td>
                  <td>DCT1175</td>
                  <td>%</td>
                </tr>
                <tr>
                  <td>Đàm Thế Hào</td>
                  <td>3117410065</td>
                  <td>Nam</td>
                  <td>DCT1175</td>
                  <td>%</td>
                </tr>
                <tr>
                  <td>Huỳnh Trung Hiển</td>
                  <td>3117410072</td>
                  <td>Nam</td>
                  <td>DCT1173</td>
                  <td>%</td>
                </tr>
                <tr>
                  <td>Hoàng Hiệp</td>
                  <td>3117410074</td>
                  <td>Nam</td>
                  <td>DCT1175</td>
                  <td>%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;