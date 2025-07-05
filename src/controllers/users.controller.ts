import { Response, Request } from 'express'
import { UserReqBody } from '~/models/requests/User.request'
import usersService from '~/services/users.service'

export const registerController = async (req: Request, res: Response) => {
  try {
    const result = await usersService.register(req.body as UserReqBody)
    res.json({
      message: 'Đăng kí thành công !',
      result
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
    return
  }
}

export const loginController = (req: Request, res: Response) => {
  res.json({
    message: 'Login thanh cong',
    accessToken: 123
  })
}
