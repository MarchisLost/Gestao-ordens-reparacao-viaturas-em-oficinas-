const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

//File requires
require('dotenv').config();
const db = require('./db/db')
const roleRoute = require('./routers/roleRoute')
const loginRoute = require('./routers/loginRoute')
const fileRoute = require('./routers/fileRoute')

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })); 
//app.use(bodyParser.urlencoded({extended: false})) 


//Routes  
app.use(roleRoute)
app.use(fileRoute)
app.use(loginRoute)

//TODO find a way to display that the username or password are wrong!! maybe bootstrap messages

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})