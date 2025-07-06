export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại!',
  // Tên
  NAME_IS_REQUIRED: 'Vui lòng nhập Tên',
  NAME_LENGTH: 'Tên phải từ 1 đến 100 ký tự',

  // Email
  EMAIL_IS_REQUIRED: 'Vui lòng nhập Email',
  EMAIL_IS_INVALID: 'Định dạng Email không hợp lệ',
  EMAIL_ALREADY_EXISTS: 'Email đã được sử dụng',

  // Mật khẩu
  PASSWORD_IS_REQUIRED: 'Vui lòng nhập Mật khẩu',
  PASSWORD_LENGTH: 'Mật khẩu phải từ 6 đến 100 ký tự',
  PASSWORD_STRENGTH: 'Mật khẩu cần có ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt',

  // Xác nhận mật khẩu
  CONFIRM_PASSWORD_IS_REQUIRED: 'Vui lòng nhập Xác nhận mật khẩu',
  CONFIRM_PASSWORD_NOT_MATCH: 'Mật khẩu xác nhận không khớp',
  CONFIRM_PASSWORD_LENGTH: 'Mật khẩu phải từ 6 đến 100 ký tự',
  CONFIRM_PASSWORD_STRENGTH: 'Mật khẩu cần có ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt',

  // Ngày sinh
  DATE_OF_BIRTH_IS_REQUIRED: 'Vui lòng nhập Ngày sinh',
  DATE_OF_BIRTH_IS_INVALID: 'Ngày sinh không hợp lệ'
} as const
