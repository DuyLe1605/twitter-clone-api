import { Response, Request } from 'express'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { LogoutReqBody, RefreshTokenReqBody, TokenPayload, UserReqBody } from '~/models/requests/User.request'
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

  const result = await usersService.login((_id as ObjectId).toString())

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
  const { user_id, exp } = req.decoded_refresh_token as TokenPayload
  const result = await usersService.refreshToken({ refresh_token, exp, user_id })
  res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    refresh_token: result.refresh_token,
    access_token: result.access_token
  })
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
  }

  const result = await usersService.verifyEmail(user_id)

  res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}
