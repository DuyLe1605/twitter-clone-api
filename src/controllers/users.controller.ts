import { Response, Request } from 'express'
import User from '~/models/schemas/User.schema'

import databaseService from '~/services/database.service'
export const loginController = (req: Request, res: Response) => {
  res.json({
    message: 'Login thanh cong',
    accessToken: 123
  })
}

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const result = await databaseService.users.insertOne(new User({ email, password }))
    res.json({
      message: 'Dang ki thanh cong',
      result
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
    return
  }
}
