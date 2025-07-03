import { Collection, Db, MongoClient, MongoError, ServerApiVersion } from 'mongodb'
import 'dotenv/config'
import { UserInterface } from '~/models/schemas/user.schema'

const uri = process.env.DB_URI as string

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(process.env.DB_NAME) // db phải là tên database muốn thao tác
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error: any) {
      console.dir(error.message)
      this.close()
    }
  }

  async close() {
    await this.client.close()
  }

  get users(): Collection<UserInterface> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
}

export default new DatabaseService()
