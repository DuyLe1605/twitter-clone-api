import { Response, Request } from 'express'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'

import {
  FollowReqBody,
  GetProfileReqParams,
  LogoutReqBody,
  RefreshTokenReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UserReqBody
} from '~/models/requests/User.request'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.service'
import usersService from '~/services/users.service'

export const registerController = async (req: Request, res: Response) => {
  const result = await usersService.register(req.body as UserReqBody)
  res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
  return
}

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  if (!user) {
    throw new Error('Không lấy được User')
  }
  const { _id } = user

  const result = await usersService.login({ user_id: (_id as ObjectId).toString(), verify: user.verify })

  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
  return
}

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body as LogoutReqBody
  const result = await usersService.logout(refresh_token)

  res.json({
    message: result
  })
  return
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body as RefreshTokenReqBody
  const { user_id, exp, verify } = req.decoded_refresh_token as TokenPayload
  const result = await usersService.refreshToken({ refresh_token, exp, user_id, verify })
  res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    refresh_token: result.refresh_token,
    access_token: result.access_token
  })
  return
}

export const verifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  console.log(user_id)
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
    return
  }

  if (user.email_verify_token === '') {
    res.status(200).json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
    return
  }

  const result = await usersService.verifyEmail(user_id)

  res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
  return
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  console.log(user_id)
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
    return
  }

  if (user.email_verify_token === '') {
    res.status(200).json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
    return
  }

  const result = await usersService.resendVerifyEmail(user_id)

  res.status(200).json({
    message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_TOKEN_SUCCESS,
    result
  })
  return
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { _id, verify } = req.user as User
  const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  res.status(200).json(result)
  return
}
export const verifyForgotPasswordController = async (req: Request, res: Response) => {
  res.status(200).json({ message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS })
  return
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body as ResetPasswordReqBody

  const result = await usersService.resetPassword({ new_password: password, user_id })

  res.status(200).json(result)
  return
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await usersService.getMe(user_id)
  res.status(200).json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    data: result
  })
  return
}

export const updateMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req
  const result = await usersService.updateMe(user_id, body)
  res.status(200).json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    data: result
  })
  return
}

export const getProfileController = async (req: Request, res: Response) => {
  const { username } = req.params
  const user = await usersService.getProfileUser(username)

  res.json({ data: user, message: USERS_MESSAGES.GET_PROFILE_SUCCESS })
}

export const followUserController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body as FollowReqBody

  const result = await usersService.followUser({ followed_user_id, user_id })

  res.status(200).json(result)
}
export const unFollowUserController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { user_id: followed_user_id } = req.params

  const result = await usersService.unFollowUser({ followed_user_id, user_id })

  res.status(200).json(result)
}
