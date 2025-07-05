export interface UserReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string // Người dùng gửi lên dạng ISO String
}
