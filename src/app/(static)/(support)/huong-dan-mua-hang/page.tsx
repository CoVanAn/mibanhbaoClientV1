import "./HowtoBuy.scss";

const HowtoBuy = () => (
  <div className="howtobuy-container">
    <h1>Hướng Dẫn Mua Hàng</h1>
    {/* <ol> */}
    <li>
      <strong>
        1. Truy cập website và lựa chọn sản phẩm cần mua để mua hàng
      </strong>
    </li>
    <ul>
      <li>
        - Click vào sản phẩm muốn mua, màn hình hiển thị ra pop up với các lựa
        chọn.
      </li>
      <li>- Tiếp tục mua hàng để lựa chọn thêm sản phẩm vào giỏ hàng.</li>
      <li>- Xem giỏ hàng để cập nhật sản phẩm.</li>
      <li>- Đặt hàng và thanh toán cho sản phẩm này.</li>
    </ul>
    <li>
      <strong>2. Lựa chọn thông tin tài khoản thanh toán:</strong>
      <ul>
        <li>- Đã có tài khoản: nhập email và mật khẩu.</li>
        <li>
          - Chưa có tài khoản: điền thông tin cá nhân để đăng ký tài khoản.
        </li>
        <li>
          - Mua hàng không cần tài khoản: chọn đặt hàng không cần tài khoản.
        </li>
      </ul>
    </li>
    <li>
      <strong>
        3. Điền thông tin nhận hàng, chọn hình thức thanh toán và vận chuyển
      </strong>
    </li>
    <li>
      <strong>
        4. Xem lại thông tin đặt hàng, điền chú thích và gửi đơn hàng
      </strong>
    </li>
    <li>
      <strong>
        5. Sau khi nhận được đơn hàng, chúng tôi sẽ liên hệ xác nhận lại đơn
        hàng và địa chỉ của bạn
      </strong>
    </li>
    {/* </ol> */}
    <p>Trân trọng cảm ơn.</p>
  </div>
);

export default HowtoBuy;
