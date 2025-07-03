import express from 'express'
import userRouter from '~/routes/users.route'
import databaseService from '~/services/database.service'

const app = express()
const port = 4000

app.use(express.json())
app.use('/user', userRouter)

databaseService.connect().catch(console.dir)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
