const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const hbs = require('hbs')

//File requires
require('dotenv').config();
const db = require('./db/db')
const roleRoute = require('./routers/roleRoute')
const loginRoute = require('./routers/loginRoute')
const fileRoute = require('./routers/fileRoute')
const {getVeiculo, getVeiculoFuncionario, getClient, getOrcamento} = require('./db/templates')

const saltRounds = 10 //number of salt rounds, best one in terms of security&speed

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../public/html'))

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({extended: false})) 

//TODO validation on the login form

//Routes  
app.use(roleRoute)
app.use(fileRoute)
//TODO find a way to display that the username or password are wrong!!
app.use(loginRoute)

//test for the function on db/templates to get all the vehicle by plate
app.get('/veiculo/:id', async (req, res) => {
  const data = await getVeiculo(req.params.id)
  console.log("data", data)
  res.json({"data": data})
})

//test for the function on db/templates to get the vehicle from x worker
app.get('/asd/:id', async (req, res) => {
  const data = await getVeiculoFuncionario(req.params.id)
  console.log("data", data)
  res.json(data)
})

//test for the function on db/templates to get the client by his id
app.get('/client/:id', async (req, res) => {
  const data = await getClient(req.params.id)
  console.log("data", data)
  res.json(data)
})

//test for the function on db/templates to get the orçamento by the client id
app.get('/orc/:id', async (req, res) => {
  const data = await getOrcamento(req.params.id)
  console.log("data", data)
  res.json(data)
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})