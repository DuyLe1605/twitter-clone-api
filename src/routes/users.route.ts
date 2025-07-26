import { Router } from 'express'
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import validate from '~/utils/validation'

const usersRouter = Router()

// Description: Register a new user
// Path: /register
// Method: Post
// Body: {name:string, email:string, password:string ,confirm_password:string, date_of_birth:ISO8601}
usersRouter.post('/register', validate(registerValidator), wrapRequestHandler(registerController))

usersRouter.post('/login', validate(loginValidator), wrapRequestHandler(loginController))

usersRouter.post(
  '/logout',
  validate(accessTokenValidator),
  validate(refreshTokenValidator),
  wrapRequestHandler(logoutController)
)

usersRouter.post('/refresh-token', validate(refreshTokenValidator), wrapRequestHandler(refreshTokenController))

export default usersRouter
