import { createHash } from 'crypto'
import 'dotenv/config'

export const sha256 = (content: string) => createHash('sha256').update(content).digest('hex')

export const hashPassword = (password: string) => sha256(password + process.env.HASH_PASSWORD_SECRET_KEY)
