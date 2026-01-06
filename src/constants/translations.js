// Vietnamese translations
export const VI_TRANSLATIONS = {
  // Navigation
  home: "Trang chủ",
  menu: "Thực đơn", 
  mobileApp: "Ứng dụng di động",
  contactUs: "Liên hệ",
  signIn: "Đăng nhập",
  logout: "Đăng xuất",
  
  // Cart
  cart: "Giỏ hàng",
  cartItems: "Sản phẩm",
  title: "Tên món",
  price: "Giá",
  quantity: "Số lượng", 
  total: "Tổng cộng",
  remove: "Xóa",
  cartTotals: "Tổng tiền giỏ hàng",
  subtotal: "Tạm tính",
  deliveryFee: "Phí giao hàng",
  finalTotal: "Tổng cộng",
  proceedToCheckout: "Tiến hành thanh toán",
  emptyCart: "Giỏ hàng của bạn đang trống",
  
  // Food categories
  salad: "Salad",
  rolls: "Cuộn",
  deserts: "Tráng miệng",
  sandwich: "Bánh mì",
  cake: "Bánh ngọt",
  pureVeg: "Chay",
  pasta: "Mì Ý",
  noodles: "Mì",
  
  // Home page
  orderYourFavoriteFood: "Đặt món ăn yêu thích của bạn tại đây",
  exploreOurMenu: "Khám phá thực đơn",
  topDishesNearYou: "Món ăn hàng đầu gần bạn",
  
  // Food item
  addToCart: "Thêm vào giỏ",
  
  // Authentication
  loginTitle: "Đăng nhập",
  signUpTitle: "Đăng ký", 
  yourName: "Tên của bạn",
  yourEmail: "Email của bạn",
  password: "Mật khẩu",
  createAccount: "Tạo tài khoản",
  alreadyHaveAccount: "Đã có tài khoản?",
  dontHaveAccount: "Chưa có tài khoản?",
  clickHereToLogin: "Nhấn vào đây để đăng nhập",
  clickHereToSignUp: "Nhấn vào đây để đăng ký",
  
  // Checkout/Order
  deliveryInformation: "Thông tin giao hàng",
  firstName: "Tên",
  lastName: "Họ", 
  emailAddress: "Địa chỉ email",
  street: "Địa chỉ",
  city: "Thành phố",
  state: "Tỉnh/Thành",
  zipCode: "Mã bưu điện",
  country: "Quốc gia",
  phone: "Số điện thoại",
  placeOrder: "Đặt hàng",
  paymentMethod: "Phương thức thanh toán",
  cashOnDelivery: "Thanh toán khi nhận hàng",
  
  // Promo code
  promoCodeTitle: "Nếu bạn có mã giảm giá, nhập vào đây",
  enterPromoCode: "Nhập mã giảm giá",
  submit: "Áp dụng",
  
  // Footer
  companyDescription: "Lorem Ipsum chỉ đơn giản là văn bản giả của ngành in ấn và sắp chữ. Lorem Ipsum đã là văn bản giả tiêu chuẩn của ngành kể từ những năm 1500.",
  company: "CÔNG TY",
  aboutUs: "Về chúng tôi",
  delivery: "Giao hàng",
  privacyPolicy: "Chính sách bảo mật",
  getInTouch: "LIÊN HỆ",
  
  // Admin
  addItems: "Thêm món",
  listItems: "Danh sách món",
  orders: "Đơn hàng",
  uploadImage: "Tải ảnh lên",
  productName: "Tên sản phẩm",
  productDescription: "Mô tả sản phẩm", 
  productCategory: "Danh mục sản phẩm",
  productPrice: "Giá sản phẩm",
  add: "Thêm",
  edit: "Sửa",
  change: "Thay đổi",
  cancel: "Hủy",
  delete: "Xóa",
  
  // Messages
  foodAddedSuccessfully: "Đã thêm món ăn thành công",
  foodRemovedSuccessfully: "Đã xóa món ăn thành công", 
  loginSuccessful: "Đăng nhập thành công",
  orderPlacedSuccessfully: "Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm!",
  error: "Có lỗi xảy ra",
  loading: "Đang tải...",
  
  // Units and formatting
  currency: "₫",
  perItem: "/món",
  free: "Miễn phí",
  
  // Days of week
  monday: "Thứ 2",
  tuesday: "Thứ 3", 
  wednesday: "Thứ 4",
  thursday: "Thứ 5",
  friday: "Thứ 6",
  saturday: "Thứ 7",
  sunday: "Chủ nhật"
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

// Helper function to format number with thousands separator
export const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};
