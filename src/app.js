const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./db/db')
const {getLogin} = require('./db/login')
const roleRouter = require('./routers/roleRoutes')

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({extended: false}))

//Routes  
app.use(roleRouter)

//Login attempt, receives values from form, sends it to see if it exists in database so then it redirects to the propor role view
//TODO autorization & authentication
app.post('/loginAtempt', async (req, res) => {
  let username = req.body.email
  let pass = req.body.pass

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