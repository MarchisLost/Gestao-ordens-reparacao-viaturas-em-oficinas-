const express = require('express')
const router = new express.Router()

const {getWorkviewInfo, getTarefasCompletas, getdetalhesOrcamento, getProblemas, getListaTarefas, getClientByLink, getVeiculoById, getNomeCliente, 
  getVeiculosByFuncionario, getTarefasVeiculo} = require('../db/templates')

//! provavelmente e melhor tirar mos isto... ja nao faz sentido termos
router.get('/mecanicLogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/mecLogin.html'))
})

// Mecanico
router.get('/workview/:username', async (req, res) => {
  const username = req.params.username    // Username do funcionario
  const veiculos = await getVeiculosByFuncionario(username)   // Veiculos pertencentes a esse funcionario

  let matriculasEspera = []   // Array com as matriculas dos carros em espera
  let matriculasTrabalho = [] // Array com as matriculas dos carros em reparacao

  let veiculosEspera = []
  let veiculosReparacao = []

  // Obter matriculas e id dos veiuclos em espera
  for (i=0; i<veiculos.length; i++) {
    if (veiculos[i].estado === 'em espera') {
      matriculasEspera.push(veiculos[i].matricula)
      veiculosEspera.push(veiculos[i].id_veiculo)
    }
    else {
      matriculasTrabalho.push(veiculos[i].matricula)
      veiculosReparacao.push(veiculos[i].id_veiculo)
    }
  }

  res.render('workview' , {matriculasEspera, matriculasTrabalho, username})
})

router.get('/getTarefas/:username', async (req, res) => {
  const tempUsername = req.params.username    // Username do funcionario
  const username = tempUsername.replace(".json", "")

  const veiculos = await getVeiculosByFuncionario(username)   // Veiculos pertencentes a esse funcionario

  let matriculasEspera = []   // Array com as matriculas dos carros em espera
  let matriculasTrabalho = [] // Array com as matriculas dos carros em reparacao

  let veiculosEspera = []
  let veiculosReparacao = []

  // Obter matriculas e id dos veiuclos em espera
  for (i=0; i<veiculos.length; i++) {
    if (veiculos[i].estado === 'em espera') {
      matriculasEspera.push(veiculos[i].matricula)
      veiculosEspera.push(veiculos[i].id_veiculo)
    }
    else {
      matriculasTrabalho.push(veiculos[i].matricula)
      veiculosReparacao.push(veiculos[i].id_veiculo)
    }
  }

  let tarefasVeiculosEspera = []
  for (i=0; i<veiculosEspera.length; i++) {
    tarefasVeiculosEspera.push(await getTarefasVeiculo(veiculosEspera[i]))
  }
  // console.log(tarefasVeiculosEspera)
  
  res.json(tarefasVeiculosEspera)
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
  const clienteEspecifico = await getClientByLink(req.params.codigo)  // ID e Link do cliente
  const orcamentos = await getdetalhesOrcamento(clienteEspecifico[0].cliente)   //   Informacao do orcamento do cliente
  const problemasRelatados = await getProblemas(clienteEspecifico[0].cliente) // problemas do cliente
  const tarefasDescricao = await getListaTarefas(clienteEspecifico[0].cliente)  // tarefas do cliente
  const estadoVeiculo = await getVeiculoById(clienteEspecifico[0].cliente)   // Estado do veiculo do cliente
  const infoCliente = await getNomeCliente(clienteEspecifico[0].cliente)

  let arrayTarefa = []
  for(i = 0; i<tarefasDescricao.length; i++){
    arrayTarefa.push(tarefasDescricao[i].descricao)
  }
  
  const nomeCliente = infoCliente[0].nome
  const descricaoOrcamento = orcamentos[0].descricao
  const valorOrcamento = orcamentos[0].valor
  const problemaOrcamento = problemasRelatados[0].descricao
  const estado = estadoVeiculo[0].estado

  res.render('cliente', {nomeCliente, estado, descricaoOrcamento, valorOrcamento, problemaOrcamento, arrayTarefa})
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