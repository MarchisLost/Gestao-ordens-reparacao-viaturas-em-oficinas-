const path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.get('/mecanicLogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/mecLogin.html'))
})

app.get('/workview', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/workview.html'))
})
 
app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})