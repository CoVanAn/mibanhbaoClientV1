import "./About.scss";
import { assets } from "@/src/assets/assets";

export default function Page() {
  return (
    <div className="about-us">
      <div className="content">
        <h1>Giới thiệu</h1>
        <p>
          Chào mừng bạn tới Tiệm Bánh Bao Nhà Mi nha! Ở Tiệm Bánh Bao Nhà Mi,
          chúng tôi mang đến những hương vị truyền thống, ấm áp và thân thiện
          của bánh bao. Mỗi chiếc bánh bao được làm thủ công với tình yêu thương
          và sự chăm sóc tỉ mỉ của đôi tay người thợ.
        </p>
        <img src={assets.gioithieu} alt="Bánh Bao" />
        <p>
          Ở đây, bạn có thể thưởng thức những loại bánh bao đa dạng, từ những
          loại nhân truyền thống như thịt heo trứng cút, màn thầu, cadé (nhân
          bánh ngọt) cho đến những loại sáng tạo như bánh bao xá xíu phô mai, bò
          xốt tiêu, gà nấm hương và bánh bao nhân xúc xích tươi ngon.
        </p>
        <p>
          Chúng tôi luôn đặt chất lượng lên hàng đầu. Mỗi chiếc bánh được làm từ
          nguyên liệu tươi ngon nhất, đảm bảo vị ngon, hương thơm và độ béo ngậy
          hoàn hảo.
        </p>
        <p>
          Hãy ghé qua
          <strong> Tiệm Bánh Bao Nhà Mi</strong> để thưởng thức những chiếc bánh
          bao thơm ngon, đậm đà hương vị truyền thống và sáng tạo. Chúng tôi rất
          mong được phục vụ bạn và mang đến cho bạn những trải nghiệm ẩm thực
          tuyệt vời nhất! Hãy cùng nhau thưởng thức những chiếc bánh bao ngon
          lành tại Tiệm Bánh Bao Nhà Mi nhé!
        </p>
        <p>
          Cảm ơn bạn đã lựa chọn Tiệm Bánh Bao Nhà Mi. Hãy để chúng tôi mang đến
          cho bạn những trải nghiệm ẩm thực tuyệt vời và những khoảnh khắc đáng
          nhớ bên chiếc bánh bao thơm ngon của chúng tôi!
        </p>
      </div>
    </div>
  );
}
