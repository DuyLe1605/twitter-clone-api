import { ObjectId } from 'mongodb'

export interface RefreshTokenInterface {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at?: Date
}

export default class RefreshToken {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at: Date
  constructor({ user_id, token, created_at, _id }: RefreshTokenInterface) {
    this._id = _id
    this.user_id = user_id
    this.created_at = created_at || new Date()
    this.token = token
  }
}
