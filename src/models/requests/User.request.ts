import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface UserReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string // Người dùng gửi lên dạng ISO String
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

export interface TokenPayload extends JwtPayload {
  token_type: TokenType
  user_id: string
  exp: number
  iat: number
}
