import express from 'express'
import usersRouter from '~/routes/users.route'
import databaseService from '~/services/database.service'

const app = express()
const port = 4000

app.use(express.json())
app.use('/users', usersRouter)
databaseService.connect()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
