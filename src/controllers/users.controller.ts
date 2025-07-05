import { Response, Request } from 'express'
import usersService from '~/services/users.service'

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await usersService.register({ email, password })
    res.json({
      message: 'Dang ki thanh cong',
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
