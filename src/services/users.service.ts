import { TokenType } from '~/constants/enums'
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
    const result = await databaseService.users.insertOne(
      // Không nên lưu trực tiếp mật khẩu người dùng vào vì sẽ vi phạm quyển riêng tư
      // Và nếu mà bị lộ database thì cũng tránh nguy hiểm
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )
    const user_id = result.insertedId.toString()

    // Cho chạy song song để tăng hiệu năng
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)

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
}

const usersService = new UsersService()
export default usersService
