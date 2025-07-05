import { NextFunction, Response, Request } from 'express'
import { checkSchema } from 'express-validator'

export const registerValidator = checkSchema({
  name: {
    trim: true,
    notEmpty: { errorMessage: 'Không được để trống Tên' },

    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: 'Tên phải nằm trong khoảng 1-100 kí tự'
    }
  },
  email: {
    trim: true,
    notEmpty: { errorMessage: 'Không được để trống Email' },
    isEmail: { errorMessage: 'Email không đúng định dạng' }
  },
  password: {
    trim: true,
    notEmpty: { errorMessage: 'Không được để trống Password' },
    isLength: {
      options: { min: 6, max: 100 },
      errorMessage: 'Mật khẩu phải nằm trong khoảng 6-100 kí tự'
    },
    isStrongPassword: {
      options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
      errorMessage: 'Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số và 1 kí tự đặc biệt'
    }
  },
  confirm_password: {
    trim: true,
    notEmpty: { errorMessage: 'Không được để trống Confirm password' },
    // isLength: {
    //   options: { min: 6, max: 100 },
    //   errorMessage: 'Mật khẩu phải nằm trong khoảng 6-100 kí tự'
    // },
    // isStrongPassword: {
    //   options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    //   errorMessage: 'Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số và 1 kí tự đặc biệt'
    // }
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) throw new Error('Mật khẩu nhập lại chưa chính xác')
        return value
      }
    }
  },
  date_of_birth: {
    notEmpty: { errorMessage: 'Không được để trống ngày sinh' },
    isISO8601: { options: { strict: true, strictSeparator: true }, errorMessage: 'Ngày sinh không hợp lệ' }
  }
})

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ message: 'Thiếu Email hoặc password' })
    return
  }
  next()
}
