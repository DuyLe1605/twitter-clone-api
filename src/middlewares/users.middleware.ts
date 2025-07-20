import { checkSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.service'
import usersService from '~/services/users.service'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import 'dotenv/config'

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
      notEmpty: {
        errorMessage: 'AccessToken là bắt buộc'
      },
      custom: {
        options: async (value, { req }) => {
          const access_token = value.split('Bearer ')[1]
          console.log('acctoken', access_token)
          if (!access_token) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.VALIDATION_ERROR,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          const decoded_token = await verifyToken({
            token: access_token,
            secretOrPublicKey: process.env.SIGN_ACCESS_TOKEN_SECRET_KEY as string
          })

          console.log('decoded_token', decoded_token)
          req.decoded_authorization = decoded_token
          return true
        }
      }
    }
  },
  ['headers']
)
