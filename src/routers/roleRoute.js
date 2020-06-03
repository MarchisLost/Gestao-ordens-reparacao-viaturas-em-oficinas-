const express = require('express')
const router = new express.Router()

const {getWorkviewInfo, getTarefas} = require('../db/templates')

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

//Dashboard
router.get('/dashboard', async (req, res) => {

  const tudo = await getWorkviewInfo()   //   Informacao dos veiculos
  const tarefas = await getTarefas()
  // console.log(tarefas, tudo)
  // console.log("Comprimento: ", tarefas.length)
  

  // console.log("Numero de tarefas para veiculo 1: ", tarefas.filter(tarefa => tarefa.id_veiculo === 1).length)

  let numeroTarefasPorID = []

  for (i = 0; i < tarefas.length; i++) {
    numeroTarefasPorID.push(tarefas[i].id_veiculo)
    //console.log(tarefas[i])
  }

  const idVeiculos = [...new Set(numeroTarefasPorID)]

  let numeroTarefas = []
  let tarefasCompletas = []

  for (i = 0; i < idVeiculos.length; i++) {
    numeroTarefas.push(tarefas.filter(tarefa => tarefa.id_veiculo === idVeiculos[i]).length)
    tarefasCompletas.push(tarefas.filter(tarefa => tarefa.id_veiculo === idVeiculos[i] && tarefa.completa).length)
  }

  // console.log(numeroTarefas, tarefasCompletas)
  
  let progresso = []
  for (i = 0; i < idVeiculos.length; i++) {
    progresso.push(((100 * tarefasCompletas[i]) / numeroTarefas[i]).toFixed(0))
  }

  // Nome e matricula dos veiculos e mecanicos
  let nomes = []
  let matriculas = []

  for(i = 0; i < tudo.length; i++) {
    nomes.push(tudo[i].nome)
    matriculas.push(tudo[i].matricula)
  }

  res.render('vistaGeral', {nomes, matriculas, numeroTarefas, tarefasCompletas, progresso})
})

module.exports = router