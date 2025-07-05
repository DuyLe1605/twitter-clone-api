import jwt, { SignOptions } from 'jsonwebtoken'

export const signToken = ({
  payload,
  type,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer<ArrayBufferLike>
  type: 'accessToken' | 'refreshToken'
  privateKey?: string
  options?: SignOptions
}) => {
  const key =
    privateKey ??
    ((type === 'accessToken'
      ? process.env.SIGN_ACCESS_TOKEN_SECRET_KEY
      : process.env.SIGN_REFRESH_TOKEN_SECRET_KEY) as string)

  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, key, options, function (err, token) {
      if (err) {
        throw reject(err)
      }
      resolve(token as string)
    })
  })
}
