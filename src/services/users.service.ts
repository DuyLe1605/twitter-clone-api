import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { UserReqBody } from '~/models/requests/User.request'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.service'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import type { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import 'dotenv/config'
import { USERS_MESSAGES } from '~/constants/messages'

class UsersService {
  async register(payload: UserReqBody) {
    const user_id = new ObjectId()

    const email_verify_token = await this.signEmailVerifyToken({ user_id: user_id.toString() })

    const result = await databaseService.users.insertOne(
      // Không nên lưu trực tiếp mật khẩu người dùng vào vì sẽ vi phạm quyển riêng tư
      // Và nếu mà bị lộ database thì cũng tránh nguy hiểm

      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    // Cho chạy song song để tăng hiệu năng
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString())

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExist(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }

  async refreshToken({ refresh_token, user_id, exp }: { refresh_token: string; user_id: string; exp: number }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id }),
      this.signRefreshToken({ user_id, exp }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])

    databaseService.refreshTokens.insertOne({ user_id: new ObjectId(user_id), token: new_refresh_token })

    return { access_token: new_access_token, refresh_token: new_refresh_token }
  }

  async verifyEmail(user_id: string) {
    const [tokens] = await Promise.all([
      this.signAccessAndRefreshToken(user_id),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $currentDate: {
            updated_at: true
          },
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified
            // updated_at: new Date()
          }
        }
      )
    ])

    const [access_token, refresh_token] = tokens
    return {
      access_token,
      refresh_token
    }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id })
    console.log('email_verify_token', email_verify_token)
    const result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $currentDate: {
          updated_at: true
        },
        $set: {
          email_verify_token: email_verify_token,
          verify: UserVerifyStatus.Verified
          // updated_at: new Date()
        }
      }
    )

    console.log(result)

    return result
  }

  async forgotPassword(user_id: string) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id })
    console.log('forgot_password_token', forgot_password_token)

    const result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $currentDate: {
          updated_at: true
        },
        $set: {
          forgot_password_token
        }
      }
    )

    console.log('forgot password result: ', result)

    return { message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD }
  }

  // Token
  private signAccessToken({ user_id }: { user_id: string }) {
    return signToken({
      privateKey: process.env.SIGN_ACCESS_TOKEN_SECRET_KEY as string,
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue }
    })
  }

  private signRefreshToken({ user_id, exp }: { user_id: string; exp?: number }) {
    if (exp) {
      return signToken({
        privateKey: process.env.SIGN_REFRESH_TOKEN_SECRET_KEY as string,
        payload: { user_id, token_type: TokenType.RefreshToken, exp }
      })
    }
    return signToken({
      privateKey: process.env.SIGN_REFRESH_TOKEN_SECRET_KEY as string,
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: { algorithm: 'HS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue }
    })
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken({ user_id }), this.signRefreshToken({ user_id })])
  }

  private signEmailVerifyToken({ user_id }: { user_id: string }) {
    return signToken({
      privateKey: process.env.SIGN_EMAIL_VERIFY_TOKEN_SECRET_KEY as string,
      payload: { user_id, token_type: TokenType.EmailVerifyToken },
      options: { algorithm: 'HS256', expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue }
    })
  }
  private signForgotPasswordToken({ user_id }: { user_id: string }) {
    return signToken({
      privateKey: process.env.SIGN_FORGOT_PASSWORD_TOKEN_SECRET_KEY as string,
      payload: { user_id, token_type: TokenType.ForgotPasswordToken },
      options: { algorithm: 'HS256', expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as StringValue }
    })
  }
}

const usersService = new UsersService()
export default usersService
