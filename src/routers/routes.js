const express = require('express')
const router = express.Router()

router.get('/mecanicLogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/mecLogin.html'))
})

router.get('/workview', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/workview.html'))
})

router.get('/rececionista', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/rececionista.html'))
})

router.get('/responsavel', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/responsavel.html'))
})

router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/admin.html'))
})

router.get('/cliente', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/cliente.html'))
})

router.get('/vistaGeral', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/vistaGeral.html'))
})

module.exports = router