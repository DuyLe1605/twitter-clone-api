import jwt, { SignOptions } from 'jsonwebtoken'
import 'dotenv/config'
import { TokenPayload } from '~/models/requests/User.request'

export const signToken = ({
  payload,

  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer<ArrayBufferLike>

  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, function (err, token) {
      if (err) {
        throw reject(err)
      }
      resolve(token as string)
    })
  })
}

// Decode token

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
