import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator, registerValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import validate from '~/utils/validation'

const usersRouter = Router()

// Description: Register a new user
// Path: /register
// Method: Post
// Body: {name:string, email:string, password:string ,confirm_password:string, date_of_birth:ISO8601}
usersRouter.post('/register', validate(registerValidator), wrapRequestHandler(registerController))

usersRouter.post('/login', validate(loginValidator), wrapRequestHandler(loginController))

export default usersRouter
