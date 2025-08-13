import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'

export interface UserReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string // Người dùng gửi lên dạng ISO String
}
export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface TokenPayload extends JwtPayload {
  token_type: TokenType
  user_id: string
  exp: number
  iat: number
  verify: UserVerifyStatus
}
