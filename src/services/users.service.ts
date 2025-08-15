import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { UpdateMeReqBody, UserReqBody } from '~/models/requests/User.request'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.service'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import type { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import 'dotenv/config'
import { USERS_MESSAGES } from '~/constants/messages'

import { ErrorWithStatus } from '~/models/Errors'
import { HTTP_STATUS } from '~/constants/httpStatus'

import Follow from '~/models/schemas/Follower.schema'

class UsersService {
  async register(payload: UserReqBody) {
    const user_id = new ObjectId()

    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

    await databaseService.users.insertOne(
      // Không nên lưu trực tiếp mật khẩu người dùng vào vì sẽ vi phạm quyển riêng tư
      // Và nếu mà bị lộ database thì cũng tránh nguy hiểm

      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        verify: UserVerifyStatus.Unverified,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    // Cho chạy song song để tăng hiệu năng
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({ user_id, verify })

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

  async refreshToken({
    refresh_token,
    user_id,
    exp,
    verify
  }: {
    refresh_token: string
    user_id: string
    exp: number
    verify: UserVerifyStatus
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, exp, verify }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])

    databaseService.refreshTokens.insertOne({ user_id: new ObjectId(user_id), token: new_refresh_token })

    return { access_token: new_access_token, refresh_token: new_refresh_token }
  }

  async verifyEmail(user_id: string) {
    const [tokens] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
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
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })
    console.log('email_verify_token', email_verify_token)
    const result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $currentDate: {
          updated_at: true
        },
        $set: {
          email_verify_token
        }
      }
    )

    console.log(result)

    return result
  }

  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
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
  async resetPassword({ user_id, new_password }: { user_id: string; new_password: string }) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $currentDate: {
          updated_at: true
        },
        $set: {
          forgot_password_token: '',
          password: hashPassword(new_password)
        }
      }
    )

    return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS }
  }
  async getMe(user_id: string) {
    const result = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    return result
  }
  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const result = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_payload as UpdateMeReqBody & { date_of_birth?: Date })
        }
      },
      {
        returnDocument: 'after',
        projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 }
      }
    )
    return result
  }

  async getProfileUser(username: string) {
    const result = await databaseService.users.findOne(
      { username },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )
    if (result === null) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return result
  }

  async followUser({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) {
    const follow = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })

    if (follow === null) {
      // Trường hợp chưa follow thì tạo mới follow trong database
      await databaseService.followers.insertOne(
        new Follow({ user_id: new ObjectId(user_id), followed_user_id: new ObjectId(followed_user_id) })
      )
      return { message: USERS_MESSAGES.FOLLOW_SUCCESS }
    }

    // Trường hợp đã follow rồi
    return { message: USERS_MESSAGES.USER_ALREADY_FOLLOWED }
  }
  async unFollowUser({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) {
    const follow = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })

    if (follow === null) {
      // Trường hợp chưa follow thì Trả về message chưa follow
      return { message: USERS_MESSAGES.ALREADY_UNFOLLOWED }
    }

    // Tìm thấy document follower
    // Nghĩa là đã follow người này rồi, thì ta tiến hành xóa document này
    await databaseService.followers.deleteOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    return { message: USERS_MESSAGES.UNFOLLOW_SUCCESS }
  }
  async changePassword({ user_id, new_password }: { user_id: string; new_password: string }) {
    await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $currentDate: {
          updated_at: true
        },
        $set: {
          password: hashPassword(new_password)
        }
      }
    )
    return { message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS }
  }

  // Token
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      privateKey: process.env.SIGN_ACCESS_TOKEN_SECRET_KEY as string,
      payload: { user_id, token_type: TokenType.AccessToken, verify },
      options: { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue }
    })
  }

  private signRefreshToken({ user_id, exp, verify }: { user_id: string; exp?: number; verify: UserVerifyStatus }) {
    if (exp) {
      return signToken({
        privateKey: process.env.SIGN_REFRESH_TOKEN_SECRET_KEY as string,
        payload: { user_id, token_type: TokenType.RefreshToken, exp, verify }
      })
    }
    return signToken({
      privateKey: process.env.SIGN_REFRESH_TOKEN_SECRET_KEY as string,
      payload: { user_id, token_type: TokenType.RefreshToken, verify },
      options: { algorithm: 'HS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue }
    })
  }

  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      privateKey: process.env.SIGN_EMAIL_VERIFY_TOKEN_SECRET_KEY as string,
      payload: { user_id, verify, token_type: TokenType.EmailVerifyToken },
      options: { algorithm: 'HS256', expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue }
    })
  }
  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      privateKey: process.env.SIGN_FORGOT_PASSWORD_TOKEN_SECRET_KEY as string,
      payload: { user_id, verify, token_type: TokenType.ForgotPasswordToken },
      options: { algorithm: 'HS256', expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as StringValue }
    })
  }
}

const usersService = new UsersService()
export default usersService
