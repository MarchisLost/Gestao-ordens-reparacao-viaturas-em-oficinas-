const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

//File requires
require('dotenv').config();
const db = require('./db/db')
const roleRouter = require('./routers/roleRoutes')
const loginRouter = require('./routers/loginRoute')

const saltRounds = 10 //number of salt rounds, best one in terms of security&speed

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({extended: false}))

//TODO validation on the login form

//Routes  
app.use(roleRouter)
//TODO find a way to display that the username or password are wrong!!
app.use(loginRouter)

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})