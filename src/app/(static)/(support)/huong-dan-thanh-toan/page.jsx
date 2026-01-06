import "./PaymentInstructions.scss";

const PaymentInstructions = () => {
  return (
    <div className="paymentinstructions-container">
      <h1>Hướng dẫn thanh toán</h1>
      <ul>
        <li>
          <strong>1. Chọn Phương Thức Thanh Toán:</strong>
          <ul>
            <li>
              Trước tiên, khi bạn đặt hàng trực tuyến, bạn sẽ được yêu cầu chọn
              phương thức thanh toán. Phổ biến nhất là thẻ tín dụng/debit, ví
              điện tử (như Momo, ZaloPay, PayPal), hoặc chuyển khoản ngân hàng.
            </li>
          </ul>
        </li>
        <li>
          <strong>2. Nhập Thông Tin Thanh Toán:</strong>
          <ul>
            <li>
              - Nếu bạn chọn thanh toán bằng thẻ, hãy nhập thông tin thẻ của
              bạn, bao gồm số thẻ, ngày hết hạn và mã bảo mật (CVV).
            </li>
            <li>
              - Nếu bạn chọn ví điện tử, bạn sẽ được chuyển đến trang đăng nhập
              hoặc yêu cầu nhập thông tin đăng nhập của tài khoản ví điện tử của
              bạn.
            </li>
            <li>
              - Nếu bạn chọn chuyển khoản ngân hàng, bạn sẽ cần thông tin tài
              khoản người nhận và thực hiện chuyển khoản từ tài khoản của bạn
              đến tài khoản của cửa hàng.
            </li>
          </ul>
        </li>
        <li>
          <strong>3. Xác Nhận Thanh Toán:</strong>
          <ul>
            <li>
              - Sau khi bạn đã nhập thông tin thanh toán, hãy xem xét kỹ thông
              tin và đảm bảo chúng chính xác.
            </li>
            <li>
              - Bạn có thể được yêu cầu nhập mã xác thực (nếu có) để hoàn thành
              thanh toán.
            </li>
          </ul>
        </li>
        <li>
          <strong>4. Nhận Xác Nhận Thanh Toán:</strong>
          <ul>
            <li>
              Sau khi thanh toán thành công, bạn sẽ nhận được một email xác nhận
              đơn hàng hoặc giao dịch, cùng với thông tin chi tiết về đơn hàng
              và số tiền đã thanh toán.
            </li>
          </ul>
        </li>
        <li>
          <strong>5. Lưu Ý An Toàn:</strong>
          <ul>
            <li>
              - Đảm bảo bạn chỉ cung cấp thông tin thanh toán trên các trang web
              được bảo vệ và an toàn.
            </li>
            <li>
              - Luôn kiểm tra URL để đảm bảo bạn đang giao dịch trên trang web
              chính thức của cửa hàng.
            </li>
          </ul>
        </li>
        <li>
          <strong>6. Theo Dõi Giao Dịch:</strong>
          <ul>
            <li>
              Theo dõi tình trạng đơn hàng hoặc giao dịch của bạn thông qua
              email xác nhận và tài khoản của bạn trên trang web cửa hàng.
            </li>
          </ul>
        </li>
        <li>
          <strong>7. Liên Hệ Hỗ Trợ:</strong>
          <ul>
            <li>
              Nếu có bất kỳ vấn đề nào liên quan đến thanh toán, hãy liên hệ với
              dịch vụ khách hàng của cửa hàng để được hỗ trợ.
            </li>
          </ul>
        </li>
      </ul>
      <p>
        Nhớ rằng việc thanh toán trực tuyến an toàn và dễ dàng hơn khi bạn tuân
        thủ các biện pháp bảo mật và sử dụng phương thức thanh toán đáng tin
        cậy.
      </p>
    </div>
  );
};

export default PaymentInstructions;
