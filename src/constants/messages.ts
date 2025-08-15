export const USERS_MESSAGES = {
  // ====== Lỗi xác thực / validation ======
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại!',

  // ====== Tên ======
  NAME_IS_REQUIRED: 'Vui lòng nhập tên',
  NAME_MUST_BE_A_STRING: 'Tên phải là chuỗi ký tự',
  NAME_LENGTH: 'Tên phải từ 1 đến 100 ký tự',

  // ====== Email ======
  EMAIL_IS_REQUIRED: 'Vui lòng nhập email',
  EMAIL_IS_INVALID: 'Định dạng email không hợp lệ',
  EMAIL_ALREADY_EXISTS: 'Email đã được sử dụng',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không chính xác',

  // ====== Mật khẩu ======
  PASSWORD_IS_REQUIRED: 'Vui lòng nhập mật khẩu',
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là chuỗi ký tự',
  PASSWORD_LENGTH: 'Mật khẩu phải từ 6 đến 100 ký tự',
  PASSWORD_STRENGTH: 'Mật khẩu cần có ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt',

  // ====== Xác nhận mật khẩu ======
  CONFIRM_PASSWORD_IS_REQUIRED: 'Vui lòng nhập xác nhận mật khẩu',
  CONFIRM_PASSWORD_NOT_MATCH: 'Mật khẩu xác nhận không khớp',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Xác nhận mật khẩu phải là chuỗi ký tự',
  CONFIRM_PASSWORD_LENGTH: 'Mật khẩu xác nhận phải từ 6 đến 100 ký tự',
  CONFIRM_PASSWORD_STRENGTH: 'Mật khẩu xác nhận cần có ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt',

  // ====== Ngày sinh ======
  DATE_OF_BIRTH_IS_REQUIRED: 'Vui lòng nhập ngày sinh',
  DATE_OF_BIRTH_IS_INVALID: 'Ngày sinh không hợp lệ',

  // ====== Người dùng / Đăng nhập - Đăng ký ======
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  LOGIN_SUCCESS: 'Đăng nhập thành công. Chào mừng bạn quay trở lại!',
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công. Cảm ơn bạn đã lựa chọn chúng tôi!',
  LOGOUT_SUCCESS: 'Bạn đã đăng xuất khỏi hệ thống thành công.',
  REFRESH_TOKEN_SUCCESS: 'Làm mới token thành công',

  // ====== Token / Xác thực ======
  ACCESS_TOKEN_IS_REQUIRED: 'Vui lòng cung cấp mã truy cập (access token) hợp lệ.',
  REFRESH_TOKEN_IS_REQUIRED: 'Vui lòng cung cấp mã làm mới (refresh token) hợp lệ.',
  REFRESH_TOKEN_IS_NOT_EXIST: 'Refresh token không tồn tại',

  // ====== Xác minh email ======
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Vui lòng cung cấp mã xác minh email',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email đã được xác minh trước đó',
  EMAIL_VERIFY_SUCCESS: 'Xác minh email thành công',
  RESEND_EMAIL_VERIFY_TOKEN_SUCCESS: 'Gửi lại mã xác minh email thành công',

  // ====== Quên / Đặt lại mật khẩu ======
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Vui lòng kiểm tra email để đặt lại mật khẩu',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Vui lòng cung cấp mã quên mật khẩu',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Xác minh quên mật khẩu thành công',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Mã quên mật khẩu không hợp lệ',
  RESET_PASSWORD_SUCCESS: 'Đặt lại mật khẩu thành công',

  // ====== Hồ sơ người dùng ======
  GET_ME_SUCCESS: 'Lấy thông tin người dùng thành công',
  USER_NOT_VERIFIED: 'Người dùng chưa xác minh tài khoản',

  // ====== Thông tin cá nhân ======
  BIO_MUST_BE_STRING: 'Tiểu sử phải là chuỗi ký tự',
  BIO_LENGTH: 'Tiểu sử phải từ 1 đến 200 ký tự',
  LOCATION_MUST_BE_STRING: 'Địa điểm phải là chuỗi ký tự',
  LOCATION_LENGTH: 'Địa điểm phải từ 1 đến 200 ký tự',
  WEBSITE_MUST_BE_STRING: 'Website phải là chuỗi ký tự',
  WEBSITE_LENGTH: 'Website phải từ 1 đến 200 ký tự',

  // ====== Username ======
  USERNAME_MUST_BE_STRING: 'Tên đăng nhập phải là chuỗi ký tự',
  USERNAME_INVALID: 'Tên đăng nhập phải từ 4-15 ký tự, chỉ gồm chữ cái, số hoặc dấu gạch dưới, và không chỉ toàn số',
  USERNAME_EXISTED: 'Tên đăng nhập đã tồn tại',
  USERNAME_IS_CURRENT: 'Tên đăng nhập mới trùng với tên đăng nhập hiện tại',

  // ====== Ảnh đại diện / Ảnh bìa ======
  IMAGE_URL_MUST_BE_STRING: 'Ảnh phải là đường dẫn hợp lệ',
  IMAGE_URL_LENGTH: 'Đường dẫn ảnh phải từ 1 đến 200 ký tự',

  // ====== Cập nhật thông tin ======
  UPDATE_ME_SUCCESS: 'Cập nhật thông tin cá nhân thành công',

  // ====== Lấy hồ sơ người khác ======
  GET_PROFILE_SUCCESS: 'Lấy hồ sơ người dùng thành công',

  INVALID_USER_ID: 'User Id không hợp lệ',
  FOLLOW_SUCCESS: 'Theo dõi thành công',
  USER_ALREADY_FOLLOWED: 'Tài khoản này đã được theo dõi',
  USER_ID_IS_CURRENT: 'Đây là ID tài khoản của bạn, không thể thực hiện hành động !',

  ALREADY_UNFOLLOWED: 'Already unfollowed',
  UNFOLLOW_SUCCESS: 'Unfollow success'
} as const
