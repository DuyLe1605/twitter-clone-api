import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.service'

class UsersService {
  async register({ email, password }: { email: string; password: string }) {
    const result = await databaseService.users.insertOne(new User({ email, password }))
    return result
  }
  async checkEmailExist(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }
}

const usersService = new UsersService()
export default usersService
