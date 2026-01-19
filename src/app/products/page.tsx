import "./Products.scss";

export default function Page() {
  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-left">
          <h1>Danh mục sản phẩm</h1>
          <ul>
            <li>Hủ tiếu</li>
            <li>Mì</li>
            <li>Bánh canh</li>
            <li>Bún</li>
            <li>Phở</li>
            <li>...</li>
          </ul>
        </div>
        <div className="products-right"></div>
      </div>
    </div>
  );
}
