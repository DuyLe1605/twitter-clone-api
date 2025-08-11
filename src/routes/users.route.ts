import { Router } from 'express'
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailValidator,
  verifyForgotPasswordTokenValidator
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

usersRouter.post('/verify-email', validate(verifyEmailValidator), wrapRequestHandler(verifyEmailController))

usersRouter.post(
  '/resend-verify-email',
  validate(accessTokenValidator),
  wrapRequestHandler(resendVerifyEmailController)
)

usersRouter.post('/forgot-password', validate(forgotPasswordValidator), wrapRequestHandler(forgotPasswordController))

usersRouter.post(
  '/verify-forgot-password',
  validate(verifyForgotPasswordTokenValidator),
  wrapRequestHandler(verifyForgotPasswordController)
)

export default usersRouter
