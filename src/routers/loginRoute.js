const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const path = require('path')

const {getLogin} = require('../db/templates')

//Login attempt, receives values from form, sends it to see if it exists in database so then it redirects to the propor role view
router.post('/loginAtempt', async (req, res) => {
  
  let username = req.body.email
  let pass = req.body.pass

  const data = await getLogin(username)
  console.log(data);

  //Receives worker data, checks his role and sends the right view
  if (data === null) {
    res.status(404).sendFile(path.join(__dirname, '../../public', '/index.html'))
  } else {
    bcrypt.compare(pass, data.password, (err, res2) => {
      if (res2 === true) {
        if (data.cargo === 'mecanico') {
          res.sendFile(path.join(__dirname, '../../public', '/html/workview.html'))
          /* res.render('/workview') */ //WHY DOESNT THIS FUCKING THING WORKS
        } else if (data.cargo === 'rececionista'){
          res.sendFile(path.join(__dirname, '../../public', '/html/rececionista.html'))
        } else if (data.cargo === 'responsavel'){
          res.sendFile(path.join(__dirname, '../../public', '/html/responsavel.html'))
        } else {
          res.sendFile(path.join(__dirname, '../../public', '/html/admin.html'))
        }
      } else {
        res.status(404).sendFile(path.join(__dirname, '../../public', '/index.html'))
      }
    })
  } 
})

//logout
router.post('/logout', (req, res) => {
  res.redirect('/')
})

module.exports = router