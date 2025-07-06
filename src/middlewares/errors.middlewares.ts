import { NextFunction, Response, Request } from 'express'
import { omit } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'

export const defaultErrorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, 'status'))
  return
}
