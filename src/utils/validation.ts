import { NextFunction, Response, Request } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

//Hàm này có thể trả về tất cả lỗi
const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validations.run(req)

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      next()
    }

    // Nếu 1 field có nhiều lỗi, errors.mapped() sẽ trả về 1 lỗi duy nhất,
    // còn  errors.array() trả về tất cả lỗi của field đó
    // Chúng ta cũng có thể thêm Bail ở bên validator
    const errorObjects = errors.mapped()

    for (const key in errorObjects) {
      // Kiểm tra xem có lỗi nào khác 422 không, nếu có thì trả về riêng lỗi đó
      const { msg } = errorObjects[key]
      if (
        msg instanceof ErrorWithStatus &&
        msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY //422
      ) {
        next(errorObjects[key].msg)
      }
    }

    // Nếu chỉ có lỗi 422 thì trả về Entity Error
    const entityErrors = new EntityError({ errors: errorObjects })
    next(entityErrors)
  }
}

export default validate
