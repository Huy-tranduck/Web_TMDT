import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styles from './TermsAndPrivacy.module.css';

const TermsAndPrivacy = () => {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' hoặc 'privacy'

  return (
    <>
      <Header />
      <div className={styles.termsContainer}>
        <div className={styles.pageHeader}>
          <h1>Điều khoản & Chính sách</h1>
          <p>Cập nhật lần cuối: 20/05/2023</p>
        </div>

          <div className={styles.tabsContainer}>
    <div className={styles.tabs}>
      <button 
        className={`${styles.tabButton} ${activeTab === 'terms' ? styles.active : ''}`}
        onClick={() => setActiveTab('terms')}
      >
        Điều khoản sử dụng
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === 'privacy' ? styles.active : ''}`}
        onClick={() => setActiveTab('privacy')}
      >
        Chính sách bảo mật
      </button>
    </div>

    <div className={styles.tabContent}>
      {activeTab === 'terms' ? (
        <div className={styles.termsSection}>
          <h2>Điều khoản sử dụng</h2>
          <div className={styles.contentPlaceholder}>
            <div className={styles.placeholderSection}>
              <h3>1. Giới thiệu</h3>
              <p>Trang web thương mại điện tử của chúng tôi chuyên cung cấp các sản phẩm điện thoại chính hãng cùng với các dịch vụ hỗ trợ đi kèm. Khi bạn sử dụng website, đồng nghĩa với việc bạn đã chấp nhận các điều khoản dưới đây.</p>
              <p>Chúng tôi có quyền thay đổi các điều khoản mà không cần báo trước. Người dùng có trách nhiệm kiểm tra định kỳ để cập nhật thông tin mới nhất.</p>
            </div>

            <div className={styles.placeholderSection}>
              <h3>2. Điều kiện sử dụng</h3>
              <p>Người dùng cần có đủ 18 tuổi trở lên để thực hiện giao dịch mua hàng.</p>
              <p>Không được sử dụng website vào các mục đích vi phạm pháp luật, lừa đảo, gây rối trật tự công cộng hoặc phá hoại hệ thống.</p>
              <p>Chúng tôi có quyền từ chối cung cấp dịch vụ với người dùng vi phạm điều khoản sử dụng.</p>
            </div>

            <div className={styles.placeholderSection}>
              <h3>3. Tài khoản người dùng</h3>
              <p>Người dùng phải cung cấp thông tin chính xác khi đăng ký tài khoản và có trách nhiệm bảo mật thông tin đăng nhập.</p>
              <p>Chúng tôi không chịu trách nhiệm với những tổn thất do người dùng để lộ thông tin tài khoản hoặc chia sẻ cho bên thứ ba.</p>
            </div>

            <div className={styles.placeholderSection}>
              <h3>4. Mua hàng & Thanh toán</h3>
              <p>Đơn hàng sẽ được xử lý sau khi chúng tôi xác nhận thanh toán thành công.</p>
              <p>Chúng tôi hỗ trợ nhiều hình thức thanh toán như: chuyển khoản ngân hàng, ví điện tử và thanh toán khi nhận hàng.</p>
              <p>Trong một số trường hợp đặc biệt, chúng tôi có thể yêu cầu xác minh danh tính để đảm bảo an toàn giao dịch.</p>
            </div>

            <div className={styles.placeholderSection}>
              <h3>5. Chính sách hoàn trả</h3>
              <p>Khách hàng có quyền đổi hoặc trả hàng trong vòng 7 ngày kể từ khi nhận hàng, với điều kiện sản phẩm còn nguyên trạng và đầy đủ phụ kiện.</p>
              <p>Chi tiết quy trình hoàn trả được hướng dẫn trong trang "Chính sách đổi trả" của website.</p>
            </div>

            <div className={styles.placeholderSection}>
              <h3>6. Các điều khoản khác</h3>
              <p>Nếu một điều khoản trong văn bản này bị vô hiệu, các điều khoản còn lại vẫn giữ nguyên hiệu lực.</p>
              <p>Mọi tranh chấp phát sinh sẽ được giải quyết theo quy định pháp luật Việt Nam.</p>
              <p>Chúng tôi cam kết cung cấp dịch vụ trung thực, minh bạch và hướng đến trải nghiệm tốt nhất cho người dùng.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.privacySection}>
          <h2>Chính sách bảo mật</h2>
          <div className={styles.contentPlaceholder}>
            <div className={styles.placeholderSection}>
              <h3>1. Thu thập thông tin</h3>
              <p>Chúng tôi thu thập thông tin cá nhân của bạn như: họ tên, email, số điện thoại, địa chỉ, lịch sử giao dịch và các thông tin kỹ thuật liên quan đến thiết bị truy cập.</p>
              <p>Mọi thông tin được thu thập đều nhằm mục đích nâng cao trải nghiệm người dùng và phục vụ quá trình xử lý đơn hàng.</p>
            </div>

            <div className={styles.placeholderSection}>
              <h3>2. Sử dụng thông tin</h3>
              <p>Thông tin thu thập sẽ được sử dụng để: xác nhận đơn hàng, liên lạc hỗ trợ, gửi thông báo khuyến mãi, và nâng cao chất lượng dịch vụ.</p>
              <p>Chúng tôi không sử dụng thông tin của bạn cho bất kỳ mục đích trái phép nào.</p>
            </div>

            <div className={styles.placeholderSection}>
              <h3>3. Bảo mật thông tin</h3>
              <p>Thông tin cá nhân được lưu trữ trong hệ thống bảo mật với các biện pháp như tường lửa, mã hóa, và kiểm soát truy cập nghiêm ngặt.</p>
              <p>Chúng tôi chỉ cho phép nhân viên được phân quyền truy cập thông tin trong phạm vi cần thiết.</p>
              <p>Mọi giao dịch thanh toán được thực hiện thông qua cổng thanh toán đạt chuẩn bảo mật quốc tế.</p>
            </div>

            <div className={styles.placeholderSection}>
              <h3>4. Cookie và công nghệ theo dõi</h3>
              <p>Website sử dụng cookie để cá nhân hóa trải nghiệm người dùng, ghi nhớ tùy chọn và phân tích hành vi truy cập.</p>
              <p>Bạn có thể từ chối cookie thông qua trình duyệt, nhưng điều này có thể ảnh hưởng đến trải nghiệm sử dụng.</p>
            </div>

            <div className={styles.placeholderSection}>
              <h3>5. Chia sẻ thông tin</h3>
              <p>Chúng tôi không chia sẻ thông tin cá nhân với bên thứ ba ngoại trừ khi có yêu cầu của cơ quan chức năng hoặc theo quy định pháp luật.</p>
              <p>Trong trường hợp cần thiết, chúng tôi có thể chia sẻ với đối tác giao hàng hoặc đơn vị cung cấp dịch vụ thanh toán để hoàn tất đơn hàng.</p>
            </div>

            <div className={styles.placeholderSection}>
              <h3>6. Quyền của người dùng</h3>
              <p>Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân bất kỳ lúc nào thông qua trang quản lý tài khoản.</p>
              <p>Bạn cũng có thể yêu cầu ngừng nhận các thông báo tiếp thị qua email hoặc tin nhắn.</p>
              <p>Chúng tôi cam kết tôn trọng và bảo vệ mọi quyền lợi hợp pháp của người dùng theo quy định pháp luật Việt Nam.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

        <div className={styles.contactSection}>
          <h3>Bạn có thắc mắc?</h3>
          <p>Nếu bạn có bất kỳ câu hỏi nào về Điều khoản hoặc Chính sách bảo mật của chúng tôi, hãy liên hệ qua:</p>
          <div className={styles.contactInfo}>
            <p><i className="fas fa-envelope"></i> <a href="mailto:support@shopsmartphone.com">support@shopsmartphone.com</a></p>
            <p><i className="fas fa-phone"></i> <a href="tel:+84987654321">0987 654 321</a></p>
            <Link to="/contact" className={styles.contactButton}>Liên hệ với chúng tôi</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndPrivacy;