import { NextFunction, Response, Request } from 'express'
import { omit } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json(omit(err, 'status'))
    return
  }

  // Để khi json.stringify, error có thể hiển thị dc dữ liệu khi enumerable là true
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, {
      value: err[key],
      enumerable: true,
      configurable: true,
      writable: true
    })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message, errorInfo: omit(err, 'stack') })
  return
}
