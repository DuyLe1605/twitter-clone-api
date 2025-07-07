import { NextFunction, Response, Request } from 'express'
import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.service'
import usersService from '~/services/users.service'
import { hashPassword } from '~/utils/crypto'

export const registerValidator = checkSchema({
  name: {
    trim: true,
    notEmpty: { errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED },

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
})

export const loginValidator = checkSchema({
  email: {
    trim: true,
    notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
    isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
    custom: {
      options: async (value, { req }) => {
        const user = await databaseService.users.findOne({ email: value, password: hashPassword(req.body.password) })
        // Nếu không tìm thầy email trong data base thì trả về lỗi
        if (!user) throw new Error(USERS_MESSAGES.USER_NOT_FOUND)

        req.user = user
        return true
      }
    }
  },
  password: {
    trim: true,
    notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
    isLength: {
      options: { min: 6, max: 100 },
      errorMessage: USERS_MESSAGES.PASSWORD_LENGTH
    },
    isStrongPassword: {
      options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
      errorMessage: USERS_MESSAGES.PASSWORD_STRENGTH
    }
  }
})
