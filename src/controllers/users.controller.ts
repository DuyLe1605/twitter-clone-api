import { Response, Request } from 'express'
import { UserReqBody } from '~/models/requests/User.request'
import usersService from '~/services/users.service'

export const registerController = async (req: Request, res: Response) => {
  const result = await usersService.register(req.body as UserReqBody)
  res.json({
    message: 'Đăng kí thành công !',
    result
  })
  return
}

export const loginController = async (req: Request, res: Response) => {
  const { user } = req as any
  if (!user) {
    throw new Error('Không lấy được User')
  }
  const { _id } = user

  const result = await usersService.login(_id)

  res.json({
    message: 'Đăng nhập thành công',
    result
  })
  return
}
