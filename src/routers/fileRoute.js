const express = require('express')
const router = express.Router()
const path = require('path')

//get the dashboard page somehow
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/vistaGeral.html'))
})

module.exports = router