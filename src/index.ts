import express, { Response, Request, NextFunction } from 'express'
import { defaultErrorHandler } from '~/middlewares/errors.middlewares'
import usersRouter from '~/routes/users.route'
import databaseService from '~/services/database.service'

const app = express()
const port = 4000

app.use(express.json())
app.use('/users', usersRouter)

// Connect database
databaseService.connect()

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
