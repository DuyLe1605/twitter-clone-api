import { ObjectId } from 'mongodb'

export interface FollowInterface {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at?: Date
}

export default class Follow {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at: Date
  constructor({ user_id, followed_user_id, _id, created_at }: FollowInterface) {
    this._id = _id
    this.user_id = user_id
    this.created_at = created_at || new Date()
    this.followed_user_id = followed_user_id
  }
}
