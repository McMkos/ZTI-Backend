require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

app.use(cors())

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true})
const conn = mongoose.connection
const db = conn.useDb('subscribers')
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to database!"))

app.use(express.json())

const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter)

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const exercisesRouter = require('./routes/exercises')
app.use('/exercises', exercisesRouter)

app.listen(3000, () => console.log('Server Started!'))