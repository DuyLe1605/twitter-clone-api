import { NextFunction, Response, Request } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

//Hàm này có thể trả về tất cả lỗi
const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validations.run(req)

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // Nếu 1 field có nhiều lỗi, errors.mapped() sẽ trả về 1 lỗi duy nhất,
      // còn  errors.array() trả về tất cả lỗi của field đó
      // Chúng ta cũng có thể thêm Bail ở bên validator
      res.status(400).json({ errors: errors.mapped() })
      return
    }

    next()
  }
}

export default validate
