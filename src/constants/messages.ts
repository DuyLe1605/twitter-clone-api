export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại!',
  // Tên
  NAME_IS_REQUIRED: 'Vui lòng nhập Tên',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH: 'Tên phải từ 1 đến 100 ký tự',

  // Email
  EMAIL_IS_REQUIRED: 'Vui lòng nhập Email',
  EMAIL_IS_INVALID: 'Định dạng Email không hợp lệ',
  EMAIL_ALREADY_EXISTS: 'Email đã được sử dụng',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không chính xác',
  // Mật khẩu
  PASSWORD_IS_REQUIRED: 'Vui lòng nhập Mật khẩu',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH: 'Mật khẩu phải từ 6 đến 100 ký tự',
  PASSWORD_STRENGTH: 'Mật khẩu cần có ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt',

  // Xác nhận mật khẩu
  CONFIRM_PASSWORD_IS_REQUIRED: 'Vui lòng nhập Xác nhận mật khẩu',
  CONFIRM_PASSWORD_NOT_MATCH: 'Mật khẩu xác nhận không khớp',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH: 'Mật khẩu phải từ 6 đến 100 ký tự',
  CONFIRM_PASSWORD_STRENGTH: 'Mật khẩu cần có ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt',

  // Ngày sinh
  DATE_OF_BIRTH_IS_REQUIRED: 'Vui lòng nhập Ngày sinh',
  DATE_OF_BIRTH_IS_INVALID: 'Ngày sinh không hợp lệ',

  // Tìm email khi đăng nhập,
  USER_NOT_FOUND: 'Email hoặc mật khẩu không chính xác',

  LOGIN_SUCCESS: 'Đăng nhập thành công. Chào mừng bạn quay trở lại!',
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công. Cảm ơn bạn đã lựa chọn chúng tôi!',
  LOGOUT_SUCCESS: 'Bạn đã đăng xuất khỏi hệ thống thành công.',
  REFRESH_TOKEN_SUCCESS: 'RefreshToken thành công',

  ACCESS_TOKEN_IS_REQUIRED: 'Yêu cầu xác thực: Vui lòng cung cấp mã truy cập (access token) hợp lệ.',
  REFRESH_TOKEN_IS_REQUIRED: 'Yêu cầu xác thực: Vui lòng cung cấp mã truy cập (refresh token) hợp lệ.',
  REFRESH_TOKEN_IS_NOT_EXIST: 'Refresh token không tồn tại'
} as const
