/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Response, Request, NextFunction } from 'express'
import usersRouter from '~/routes/users.route'
import databaseService from '~/services/database.service'

const app = express()
const port = 4000

app.use(express.json())
app.use('/users', usersRouter)

// Connect database
databaseService.connect()

app.use('/', (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.log('INDEX ERROR: ', err.message)
  res.status(400).json({ message: err.message })
  return
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
