const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

//File requires
require('dotenv').config();
const db = require('./db/db')
const {getLogin} = require('./db/login')
const roleRouter = require('./routers/roleRoutes')

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({extended: false}))

//TODO validation on the login form

//Session stuff
//app.set('trust proxy', 1) // trust first proxy //lets have this sitting here just in case something doesnt work and this solves it idk
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

//Routes  
app.use(roleRouter)

//Login attempt, receives values from form, sends it to see if it exists in database so then it redirects to the propor role view
//TODO autorization & authentication
app.post('/loginAtempt', async (req, res) => {
  //TODO bcrypt the password
  let username = req.body.email
  let pass = req.body.pass

  //Session authentication stuff
  passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/index',
    failureFlash: true })

  const data = await getLogin(username, pass)
  console.log(data);

  //Receives worker data, checks his role and sends the right view
  if (data === null) {
    res.status(404).send('nao existe nome')
  } else {
    if (data.cargo === 'mecanico') {
      res.sendFile(path.join(__dirname, '../public', '/html/workview.html'))
    } else if (data.cargo === 'rececionista'){
      res.sendFile(path.join(__dirname, '../public', '/html/rececionista.html'))
    } else {
      res.sendFile(path.join(__dirname, '../public', '/html/responsavel.html'))
    }
  }
})


app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})