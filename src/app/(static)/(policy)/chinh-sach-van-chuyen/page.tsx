import "../chinh-sach-bao-mat/PrivacyPolicy.scss";

export default function Page() {
  return (
    <div className="privacy-policy-container">
      <h1>Chính Sách Vận Chuyển</h1>
      <div className="policy-section">
        <h2>1. Sản phẩm Bột Bánh Bao Pha Sẵn</h2>
        <ul>
          <li>
            - Đồng giá vận chuyển 15,000vnđ toàn lãnh thổ Việt Nam và{" "}
            <b>miễn phí vận chuyển</b> khi mua từ 2 gói bất kỳ trở lên.
          </li>
          <li>- Thời gian vận chuyển 2-7 ngày tùy khu vực.</li>
        </ul>
      </div>
      <div className="policy-section">
        <h2>2. Sản phẩm Bánh Bao đóng gói đông lạnh</h2>
        <ul>
          <li>
            - Khu vực nội ô thành phố Hồ Chí Minh: Đồng giá vận chuyển 25,000vnđ
            (Đơn hàng đặt trước 12h00 giao trong ngày, sau 12h00 giao vào ngày
            tiếp theo).
          </li>
          <li>
            - Khu vực ngoại ô thành phố Hồ Chí Minh & các tỉnh thành khác: Vận
            chuyển theo gói hỏa tốc giao đến chành xe trong nội ô thành phố Hồ
            Chí Minh, phí chành khách hàng tự thanh toán.
          </li>
        </ul>
      </div>
      <div className="policy-section">
        <h2>3. Đơn hàng áp dụng chiết khấu theo giá sỉ</h2>
        <ul>
          <li>
            - Phí vận chuyển tính theo cước phí thực tế của đơn vị vận chuyển.
          </li>
        </ul>
      </div>
    </div>
  );
}
