import { check, checkSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.service'
import usersService from '~/services/users.service'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import 'dotenv/config'
import { capitalize } from 'lodash'
import { JsonWebTokenError } from 'jsonwebtoken'
import { Request } from 'express'
import { ObjectId } from 'mongodb'

export const registerValidator = checkSchema(
  {
    name: {
      trim: true,
      notEmpty: { errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
      },
      isLength: {
        options: { min: 1, max: 100 },
        errorMessage: USERS_MESSAGES.NAME_LENGTH
      }
    },
    email: {
      trim: true,
      notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
      isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
      custom: {
        options: async (value) => {
          // Không cần try catch, cứ throw lỗi nếu sai vì hàm validate đã xử lí nó rồi
          const exist = await usersService.checkEmailExist(value)
          if (exist) throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)

          return value
        }
      }
    },
    password: {
      trim: true,
      notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: { min: 6, max: 100 },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH
      },
      isStrongPassword: {
        options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
        errorMessage: USERS_MESSAGES.PASSWORD_STRENGTH
      }
    },
    confirm_password: {
      trim: true,
      notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },

      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH)
          return value
        }
      },
      isString: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: { min: 6, max: 100 },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH
      },
      isStrongPassword: {
        options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_STRENGTH
      }
    },
    date_of_birth: {
      notEmpty: { errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_IS_REQUIRED },
      isISO8601: {
        options: { strict: true, strictSeparator: true },
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_IS_INVALID
      }
    }
  },
  ['body']
)

export const loginValidator = checkSchema(
  {
    email: {
      trim: true,
      notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
      isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value, password: hashPassword(req.body.password) })
          // Nếu không tìm thầy email trong data base thì trả về lỗi
          console.log(user)
          if (!user) throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
          console.log('pass')
          req.user = user
          return true
        }
      }
    },
    password: {
      trim: true,
      notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: { min: 6, max: 100 },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH
      },
      isStrongPassword: {
        options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
        errorMessage: USERS_MESSAGES.PASSWORD_STRENGTH
      }
    }
  },
  ['body']
)

export const accessTokenValidator = checkSchema(
  {
    Authorization: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          const access_token = (value || '').split(' ')[1]

          if (!access_token) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.VALIDATION_ERROR,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          try {
            const decoded_token = await verifyToken({
              token: access_token,
              secretOrPublicKey: process.env.SIGN_ACCESS_TOKEN_SECRET_KEY as string
            })

            ;(req as Request).decoded_authorization = decoded_token
          } catch (error) {
            throw new ErrorWithStatus({
              message: capitalize((error as JsonWebTokenError).message),
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          return true
        }
      }
    }
  },
  ['headers']
)

export const refreshTokenValidator = checkSchema(
  {
    refresh_token: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          try {
            console.log(value)
            const [decoded_refresh_token, refresh_token] = await Promise.all([
              verifyToken({ token: value, secretOrPublicKey: process.env.SIGN_REFRESH_TOKEN_SECRET_KEY as string }),
              databaseService.refreshTokens.findOne({ token: value })
            ])

            if (refresh_token === null) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.REFRESH_TOKEN_IS_NOT_EXIST,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            ;(req as Request).decoded_refresh_token = decoded_refresh_token
          } catch (error) {
            if (error instanceof JsonWebTokenError) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            throw error
          }
          return true
        }
      }
    }
  },
  ['body']
)

export const verifyEmailValidator = checkSchema(
  {
    email_verify_token: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          console.log('verifyEmailValidator', value)
          if (!value) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          try {
            const decoded_email_verify_token = await verifyToken({
              token: value,
              secretOrPublicKey: process.env.SIGN_EMAIL_VERIFY_TOKEN_SECRET_KEY as string
            })
            console.log('decode', decoded_email_verify_token)
            ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
          } catch (error) {
            throw new ErrorWithStatus({
              message: (error as JsonWebTokenError).message,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
        }
      }
    }
  },
  ['body']
)

export const forgotPasswordValidator = checkSchema(
  {
    email: {
      trim: true,
      notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
      isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
      custom: {
        options: async (value, { req }) => {
          console.log('check')
          const user = await databaseService.users.findOne({ email: value })
          // Nếu không tìm thầy email trong data base thì trả về lỗi

          if (!user) throw new Error('Email không tồn tại, vui lòng kiểm tra lại')

          req.user = user
          return true
        }
      }
    }
  },
  ['body']
)

export const verifyForgotPasswordTokenValidator = checkSchema({
  forgot_password_token: {
    trim: true,
    custom: {
      options: async (value, { req }) => {
        if (!value)
          throw new ErrorWithStatus({
            message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
            status: HTTP_STATUS.UNAUTHORIZED
          })

        try {
          const decoded_forgot_password_token = await verifyToken({
            token: value,
            secretOrPublicKey: process.env.SIGN_FORGOT_PASSWORD_TOKEN_SECRET_KEY as string
          })
          console.log('decode', decoded_forgot_password_token)
          const { user_id } = decoded_forgot_password_token

          const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

          if (user === null) {
            throw new ErrorWithStatus({ status: HTTP_STATUS.UNAUTHORIZED, message: USERS_MESSAGES.USER_NOT_FOUND })
          }
          if (user.forgot_password_token !== value) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.UNAUTHORIZED,
              message: USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN
            })
          }
        } catch (error) {
          throw new ErrorWithStatus({
            message: (error as JsonWebTokenError).message,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }

        // IF passed the validator
        return true
      }
    }
  }
})
