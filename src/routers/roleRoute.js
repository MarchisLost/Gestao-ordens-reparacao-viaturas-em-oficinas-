const express = require('express')
const router = new express.Router()

const {getWorkviewInfo, getTarefasCompletas, getdetalhesOrcamento, getLinks, getProblemas, getListaTarefas} = require('../db/templates')

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

// Cliente
router.get('/cliente/:codigo', async(req, res) => {
  const codigos = await getLinks()    // Links dos clientes
  const orcamentos = await getdetalhesOrcamento()   //   Informacao dos orcamentos
  const problemasRelatados = await getProblemas() // problemas dos clientes
  const tarefasDescricao = await getListaTarefas()

  //console.log(tarefasDescricao)

  //console.log(problemasRelatados)

  // Grab client who has the code in the URL
  var clienteEspecifico = codigos.filter(function(some) {
    return some.link === req.params.codigo;
  });

  // Grab specific client budget details
  var detalhesOrcamento = orcamentos.filter(function(another) {
    return another.id_cliente === clienteEspecifico[0].id_cliente;
  });

  // Grab specific problem from the client in question
  var problemaEspecifico = problemasRelatados.filter(function(thing) {
    return thing.cliente === clienteEspecifico[0].id_cliente;
  });

  // Grab tasks specific to client problem
  var tarefaEspecifica = tarefasDescricao.filter(function(yikes) {
    return yikes.cliente === clienteEspecifico[0].id_cliente;
  });
  
  let arrayTarefa = []
  for(i = 0; i<tarefaEspecifica.length; i++){
    arrayTarefa.push(tarefaEspecifica[i].descricao)
  }
  
  // console.log(arrayTarefa)
  
  const nomeCliente = detalhesOrcamento[0].nome
  const estadoVeiculo = detalhesOrcamento[0].estado
  const descricaoOrcamento = detalhesOrcamento[0].descricao
  const valorOrcamento = detalhesOrcamento[0].valor
  const problemaOrcamento = problemaEspecifico[0].descricao

  res.render('cliente', {nomeCliente, estadoVeiculo, descricaoOrcamento, valorOrcamento, problemaOrcamento, arrayTarefa})
})

//Dashboard
router.get('/dashboard', async (req, res) => {

  const tudo = await getWorkviewInfo()   //   Informacao dos veiculos
  const tarefas = await getTarefasCompletas()
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