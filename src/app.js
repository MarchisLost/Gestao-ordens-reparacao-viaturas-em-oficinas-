const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
/* const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy; */

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

/* //Session stuff
//app.set('trust proxy', 1) // trust first proxy //lets have this sitting here just in case something doesnt work and this solves it idk
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session()) */

//Routes  
app.use(roleRouter)
app.use(loginRouter)

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})