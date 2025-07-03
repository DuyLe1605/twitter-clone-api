import { Response, Request } from 'express'
export const loginController = (req: Request, res: Response) => {
  res.json({
    message: 'Login thanh cong',
    accessToken: 123
  })
}
