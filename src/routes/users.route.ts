import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator } from '~/middlewares/users.middleware'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.send('Home page')
})
// define the about route
usersRouter.post('/login', loginValidator, loginController)
usersRouter.post('/register', loginValidator, registerController)

export default usersRouter
