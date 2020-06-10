const express = require('express')
const router = new express.Router()

const { getWorkviewInfo, getTarefasCompletas, getdetalhesOrcamento, 
  getProblemas, getListaTarefas, getFuncionarioByUsername,
  getClientByLink, getVeiculoById, getNomeCliente, aprovarOrcamento,
  getVeiculosByFuncionario, getTarefasVeiculo, maxIDVeiculo,
  getVeiculo, getIdChecklistByEntrada, adicionarTarefa, maxIDTarefa, getListaMecanicos,
  getTarefasIncompletas, markTaskAsCompleted, getListaVeiculos, adicionarVeiculo, getTarefasAllVeiculos } = require('../db/templates')


// Mecanico
router.get('/workview/:username', async (req, res) => {
  const username = req.params.username    // Username do funcionario
  const veiculos = await getVeiculosByFuncionario(username)   // Veiculos pertencentes a esse funcionario

  let matriculasEspera = []   // Array com as matriculas dos carros em espera
  let matriculasTrabalho = [] // Array com as matriculas dos carros em reparacao

  let veiculosEspera = []
  let veiculosReparacao = []

  // Obter matriculas e id dos veiuclos em espera
  for (i = 0; i < veiculos.length; i++) {
    if (veiculos[i].estado === 'em espera') {
      matriculasEspera.push(veiculos[i].matricula)
      veiculosEspera.push(veiculos[i].id_veiculo)
    }
    else {
      matriculasTrabalho.push(veiculos[i].matricula)
      veiculosReparacao.push(veiculos[i].id_veiculo)
    }
  }

  res.render('workview', { matriculasEspera, matriculasTrabalho, username })
})

router.get('/getTarefas/:username', async (req, res) => {
  const tempUsername = req.params.username    // Username do funcionario
  const username = tempUsername.replace(".json", "")

  const veiculos = await getVeiculosByFuncionario(username)   // Veiculos pertencentes a esse funcionario

  let veiculosEspera = []

  // Obter matriculas e id dos veiculos em espera
  for (i = 0; i < veiculos.length; i++) {
    if (veiculos[i].estado === 'em espera') {
      veiculosEspera.push(veiculos[i].id_veiculo)
    }
  }

  let tarefasVeiculosEspera = []
  for (i = 0; i < veiculosEspera.length; i++) {
    tarefasVeiculosEspera.push(await getTarefasVeiculo(veiculosEspera[i]))
  }

  res.json(tarefasVeiculosEspera)
})


router.post('/comecarCarro/:username/:id', async (req, res) => {
  const username = req.params.username
  const estado = "em reparacao"
  const update = await getVeiculo(req.params.id, estado)

  res.redirect('/workview/' + username)
})

router.get('/emReparacao/:username', async (req, res) => {
  const tempUsername = req.params.username    // Username do funcionario
  const username = tempUsername.replace(".json", "")

  const veiculos = await getVeiculosByFuncionario(username)   // Veiculos pertencentes a esse funcionario
  let matriculasTrabalho = [] // Array com as matriculas dos carros em reparacao
  let veiculosReparacao = []

  // Obter matriculas e id dos veiuclos em espera
  for (i = 0; i < veiculos.length; i++) {
    if (veiculos[i].estado === 'em reparacao') {
      matriculasTrabalho.push(veiculos[i].matricula)
      veiculosReparacao.push(veiculos[i].id_veiculo)
    }
  }

  let tarefasVeiculosReparacao = []
  for (i = 0; i < veiculosReparacao.length; i++) {
    tarefasVeiculosReparacao.push(await getTarefasIncompletas(veiculosReparacao[i]))
  }
  res.json(tarefasVeiculosReparacao)
})

router.post('/sairCarro/:username/:id', async (req, res) => {
  const username = req.params.username
  const estado = "em espera"
  const update = await getVeiculo(req.params.id, estado)

  res.redirect('/workview/' + username)
})

router.post('/terminarCarro/:username/:id', async (req, res) => {
  const username = req.params.username
  const estado = "reparado"
  const update = await getVeiculo(req.params.id, estado)

  res.redirect('/workview/' + username)
})

router.post('/updateTarefa/:username/:id', async (req, res) => {
  const idTarefa = req.params.id
  const username = req.params.username
  const update = await markTaskAsCompleted(idTarefa)

  res.redirect('/workview/' + username)
})

router.post('/addTarefa/:username/:idEntrada/:textoAcao/:textoDescricao/:obrigatorio', async (req, res) => {
  const username = req.params.username
  const entrada_id = req.params.idEntrada
  const acaoTexto = req.params.textoAcao
  const descricaoTexto = req.params.textoDescricao

  var obrigatorio_valor;
  if(req.params.obrigatorio === true) {
    obrigatorio_valor = "sim"
  }
  else {
    obrigatorio_valor = "nao"
  }
  var maxID = await maxIDTarefa()
  maxID.max = maxID.max + 1

  const checklistAlvo = await getIdChecklistByEntrada(entrada_id)
  const inserirTarefa = await adicionarTarefa(acaoTexto, descricaoTexto, obrigatorio_valor, checklistAlvo.id_checklist, maxID.max)

  res.redirect('/workview/' + username)
})


// Rececionista
router.get('/rececionista/:username', async (req, res) => {
  const user = req.params.username

  res.render('rececionista', {user})
})

router.get('/getVeiculos', async (req, res) => {
  const veiculos = await getListaVeiculos()

  res.json(veiculos)
})

router.get('/getMecanicos', async (req, res) => {
  const mecanicos = await getListaMecanicos()

  res.json(mecanicos)
})

router.post('/adicionarVeiculo', async (req, res) => {

  const matriculaVeiculo = req.body.matricula
  const corVeiculo = req.body.cor
  const marcaVeiculo = req.body.marca
  const modeloVeiculo = req.body.modelo
  const mecanicoEncarregue = req.body.escolhaFuncionario
  const idMecanico = await getFuncionarioByUsername(mecanicoEncarregue)

  const idVeiculo = await maxIDVeiculo()

  idVeiculo.max = idVeiculo.max + 1

  const novoVeiculo = await adicionarVeiculo(idVeiculo.max, matriculaVeiculo, corVeiculo, marcaVeiculo, modeloVeiculo, idMecanico.id_funcionario)

  res.redirect('/rececionista/' + req.body.nomeRececionista)
})


// Responsavel ------------------------------------------------------
//Renders the responsavel page and sends matriculas for later purposes
router.get('/responsavel/:username', async (req, res) => {
  const user = req.params.username

  //Get all veiculos data
  const veiculos = await getListaVeiculos()

  // Arrays com as matriculas dos carros
  let matriculasEspera = []   
  let matriculasTrabalho = [] 
  let matriculasProntas = []

  // Obter matriculas e id dos veiuclos
  for (i = 0; i < veiculos.length; i++) {
    if (veiculos[i].estado === 'em espera') {
      matriculasEspera.push(veiculos[i].matricula)
    }
    else if (veiculos[i].estado === 'em reparacao') {
      matriculasTrabalho.push(veiculos[i].matricula)
    } else {
      matriculasProntas.push(veiculos[i].matricula)
    }
  }

  res.render('responsavel', {user, matriculasEspera, matriculasTrabalho, matriculasProntas})
})

//It will be called on responsabel hbs page, and this send veiculos id and tarefas
router.get('/getAllTarefas', async (req, res) => {
  const veiculos = await getListaVeiculos()

  //Arrays com os ids dos carros
  let veiculosEspera = []
  let veiculosReparacao = []
  let veiculosProntos = []

  // Obter id dos veiculos em espera, reparacao e porntos
  for (i = 0; i < veiculos.length; i++) {
    if (veiculos[i].estado === 'em espera') {
      veiculosEspera.push(veiculos[i].id_veiculo)
    }
    else if (veiculos[i].estado === 'em reparacao') {
      veiculosReparacao.push(veiculos[i].id_veiculo)
    } else {
      veiculosProntos.push(veiculos[i].id_veiculo)
    }
  }

  //Arrays com as atrefas correspondenets a cada veiculo
  let tarefasVeiculosEspera = []
  let tarefasVeiculosReparacao = []
  let tarefasVeiculosProntos = []

  //Get tarefas from espera
  for (i = 0; i < veiculosEspera.length; i++) {
    tarefasVeiculosEspera.push(await getTarefasVeiculo(veiculosEspera[i]))
  }
  //console.log('tarefasVeiculosEspera', tarefasVeiculosEspera)

  //Get tarefas from reparacao
  for (i = 0; i < veiculosReparacao.length; i++) {
    tarefasVeiculosReparacao.push(await getTarefasVeiculo(veiculosReparacao[i]))
  }
  //console.log("tarefasVeiculosReparacao", tarefasVeiculosReparacao)

  //Get tarefas from prontos
  for (i = 0; i < veiculosProntos.length; i++) {
    tarefasVeiculosProntos.push(await getTarefasVeiculo(veiculosProntos[i]))
  }
  //console.log("tarefasVeiculosProntos", tarefasVeiculosProntos)

  res.json({tarefasVeiculosEspera, tarefasVeiculosReparacao, tarefasVeiculosProntos})
})


// Admin
router.get('/admin', (req, res) => {
  res.render('admin')
})

// Cliente
router.get('/cliente/:codigo', async (req, res) => {
  const clienteEspecifico = await getClientByLink(req.params.codigo)  // ID e Link do cliente
  const orcamentos = await getdetalhesOrcamento(clienteEspecifico[0].cliente)   //   Informacao do orcamento do cliente
  const problemasRelatados = await getProblemas(clienteEspecifico[0].cliente) // problemas do cliente
  const tarefasDescricao = await getListaTarefas(clienteEspecifico[0].cliente)  // tarefas do cliente
  const estadoVeiculo = await getVeiculoById(clienteEspecifico[0].cliente)   // Estado do veiculo do cliente
  const infoCliente = await getNomeCliente(clienteEspecifico[0].cliente)

  let arrayTarefa = []
  for (i = 0; i < tarefasDescricao.length; i++) {
    arrayTarefa.push(tarefasDescricao[i].descricao)
  }

  const nomeCliente = infoCliente[0].nome
  const descricaoOrcamento = orcamentos[0].descricao
  const valorOrcamento = orcamentos[0].valor
  const problemaOrcamento = problemasRelatados[0].descricao
  const estado = estadoVeiculo[0].estado

  res.render('cliente', { nomeCliente, estado, descricaoOrcamento, valorOrcamento, problemaOrcamento, arrayTarefa })
})

router.post('/orcamentoAprovado/:link', async (req, res) => {
  
  const urlCode = req.params.link

  // Get Time
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  let currentTime;

  function getTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    return  h + ":" + m + ":" + s;
  }

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today = yyyy + '-' + mm + '-' + dd;
  currentTime = getTime()

  var idCliente = await getClientByLink(urlCode)
  idCliente = idCliente[0].cliente

  const submitDetails = await aprovarOrcamento(today, currentTime, idCliente)

  res.render('aproveSuccess')
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

  for (i = 0; i < tudo.length; i++) {
    nomes.push(tudo[i].nome)
    matriculas.push(tudo[i].matricula)
  }

  res.render('vistaGeral', { nomes, matriculas, numeroTarefas, tarefasCompletas, progresso })
})

module.exports = router