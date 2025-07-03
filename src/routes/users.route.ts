import { Router } from 'express'
import { loginController } from '~/controllers/users.controller'
import { loginValidator } from '~/middlewares/users.middleware'

const userRouter = Router()

userRouter.get('/', (req, res) => {
  res.send('Home page')
})
// define the about route
userRouter.post('/login', loginValidator, loginController)

export default userRouter
