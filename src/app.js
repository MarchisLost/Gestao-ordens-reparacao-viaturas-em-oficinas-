const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./db/db')

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({extended: false}))

//testDB
db.authenticate()
  .then(() => console.log('DB Working'))
  .catch((err) => console.log('Error: ', err))

//Routes  
app.get('/mecanicLogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/mecLogin.html'))
})

app.get('/workview', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/workview.html'))
})

app.get('/rececionista', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/rececionista.html'))
})

app.get('/responsavel', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/responsavel.html'))
})

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/admin.html'))
})

app.get('/cliente', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/cliente.html'))
})

app.get('/vistaGeral', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/vistaGeral.html'))
})


//Login attempt
app.post('/loginAtempt', (req, res) => {
  res.send('here')
})


app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})