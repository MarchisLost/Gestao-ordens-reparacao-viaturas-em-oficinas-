const express = require('express')
const router = new express.Router()
const bcrypt = require('bcrypt')

const {getLogin} = require('../db/templates')

//Login attempt, receives values from form, sends it to see if it exists in database so then it redirects to the propor role view
router.post('/loginAtempt', async (req, res) => {
  
  let username = req.body.email
  let pass = req.body.pass

  const data = await getLogin(username)

  //Receives worker data, checks his role and sends the right view
  if (data === null) {
    res.status(404).redirect('/')
  } else {
    bcrypt.compare(pass, data.password, (err, res2) => {
      if (res2 === true) {
        if (data.cargo === 'mecanico') {
          res.redirect('workview/' + username)
        } else if (data.cargo === 'rececionista'){  
          res.redirect('rececionista/' + username)
        } else if (data.cargo === 'responsavel'){
          res.redirect('responsavel/' + username)
        } else {
          res.redirect('admin/' + username)
        }
      } else {
        res.status(404).redirect('/')
      }
    })
  } 
})

//logout
router.post('/logout', (req, res) => {
  res.redirect('/')
})

module.exports = router