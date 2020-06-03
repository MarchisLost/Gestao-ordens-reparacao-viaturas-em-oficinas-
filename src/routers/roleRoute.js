const express = require('express')
const router = new express.Router()

router.get('/mecanicLogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/mecLogin.html'))
})

router.get('/workview', (req, res) => {
  res.render('workview')
})

router.get('/rececionista', (req, res) => {
  res.render('rececionista')
})

router.get('/responsavel', (req, res) => {
  res.render('responsavel')
})

router.get('/admin', (req, res) => {
  res.render('admin')
})

router.get('/cliente', (req, res) => {
  res.render('cliente')
})

router.get('/vistaGeral', (req, res) => {
  res.render('vistaGeral')
})

module.exports = router