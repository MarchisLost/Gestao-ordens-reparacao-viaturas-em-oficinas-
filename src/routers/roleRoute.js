const express = require('express')
const router = new express.Router()
const bcrypt = require('bcrypt')
require('dotenv').config()
const saltRounds = 10

const { getWorkviewInfo, getTarefasCompletas, getdetalhesOrcamento, 
  getProblemas, getListaTarefas, getFuncionarioByUsername,
  getClientByLink, getVeiculoById, getNomeCliente, aproletOrcamento,
  getVeiculosByFuncionario, getTarefasVeiculo, maxIDVeiculo,
  getVeiculo, getIdChecklistByEntrada, adicionarTarefa, maxIDTarefa, getListaMecanicos,
  getTarefasIncompletas, markTaskAsCompleted, getListaVeiculos, adicionarVeiculo, adicionarFuncionario, getFuncionario, editFuncionario, getLogin, getClientIdByEmail, aproletOrcamentoIdVeiculo, getVeiculoIdByPlate, newChecklist, getClientes, getChecklists, addEntrada, addCliente } = require('../db/templates')

//--------------------------------------------------------------------
// Mecanico ----------------------------------------------------------
//--------------------------------------------------------------------

router.get('/workview/:username', async (req, res) => {
  const username = req.params.username    // Username do funcionario

  res.render('workview', {username})
})

router.get('/getMatriculas/:username', async (req, res) => {
  const tempUsername = req.params.username
  const username = tempUsername.replace(".json", "")

  const veiculos = await getVeiculosByFuncionario(username)   // Veiculos pertencentes a esse funcionario

  let matriculasEspera = []   // Array com as matriculas dos carros em espera
  let matriculasTrabalho = [] // Array com as matriculas dos carros em reparacao

  let veiculosEspera = []
  let veiculosReparacao = []

  // Obter matriculas e id dos veiuclos em espera ou reparaçao
  for (i = 0; i < veiculos.length; i++) {
    if (veiculos[i].estado === 'em espera') {
      matriculasEspera.push(veiculos[i].matricula)
      veiculosEspera.push(veiculos[i].id_veiculo)
    }
    else if (veiculos[i].estado === 'em reparacao') {
      matriculasTrabalho.push(veiculos[i].matricula)
      veiculosReparacao.push(veiculos[i].id_veiculo)
    }
  }

  res.json({matriculasEspera, matriculasTrabalho, username})
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
  const estado = "pronto"
  const update = await getVeiculo(req.params.id, estado)

  res.redirect('/workview/' + username)
})

router.post('/updateTarefa/:username/:idTarefa/:idVeiculo', async (req, res) => {
  const idTarefa = req.params.idTarefa
  const idVeiculo = req.params.idVeiculo
  const username = req.params.username
  const update = await markTaskAsCompleted(idTarefa)

  //Check if there are others tarefas not done and if not put the veiculo pronto
  const tarefasIncompletas = await getTarefasIncompletas(idVeiculo)
  if (tarefasIncompletas == '') {
    const estado = "pronto"
    const update = await getVeiculo(idVeiculo, estado)
  }

  res.redirect('/workview/' + username)
})

router.post('/addTarefa/:username/:idEntrada/:textoAcao/:textoDescricao/:obrigatorio', async (req, res) => {
  const username = req.params.username
  const entrada_id = req.params.idEntrada
  const acaoTexto = req.params.textoAcao
  const descricaoTexto = req.params.textoDescricao

  let obrigatorio_valor;
  if(req.params.obrigatorio === true) {
    obrigatorio_valor = "sim"
  }
  else {
    obrigatorio_valor = "nao"
  }
  let maxID = await maxIDTarefa()
  maxID.max = maxID.max + 1

  const checklistAlvo = await getIdChecklistByEntrada(entrada_id)
  const inserirTarefa = await adicionarTarefa(acaoTexto, descricaoTexto, obrigatorio_valor, checklistAlvo.id_checklist, maxID.max)

  res.redirect('/workview/' + username)
})

//---------------------------------------------------------------------
// Rececionista--------------------------------------------------------
//--------------------------------------------------------------------

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

router.get('/getClientes', async (req, res) => {
  const clients = await getClientes()

  res.json(clients)
})

router.get('/getChecklists', async (req, res) => {
  const checklist = await getChecklists()

  res.json(checklist)
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

/* router.get('/getVeiculosCliente/:id', async (req, res) => {
  const idCliente = req.params.id
  console.log("idCliente", idCliente)
  const veiculos = await getListaVeiculos()
  console.log("veiculos", veiculos)

  res.json(veiculos)
}) */

//Add new entrada view page
router.get('/adicionarEntrada/:username', async (req, res) => {
  const user = req.params.username
  
  res.render('addEntrada', {user})
})

router.post('/addEntrada', async (req, res) => {
  let data = req.body
  //console.log("data", data)
  //Insert cliente and/or get clienteId
  let idCliente
  if (data.escolhaCliente != "") {
    let clientEmail = data.escolhaCliente
    idCliente = await getClientIdByEmail(clientEmail)
    idCliente = idCliente.id_cliente
    
  } else {
    let nomeCliente = data.nome
    let NCCliente = data.nrContribuinte
    let idadeCliente = data.idade
    let moradaCliente = data.morada
    let CPCliente = data.codigoPostal
    let telCliente = data.telemovel
    let emailCliente = data.email
    let newCliente = await addCliente(nomeCliente, NCCliente, idadeCliente, moradaCliente, CPCliente, telCliente, emailCliente)
    idCliente = newCliente[0].id_cliente
  }

  //Get mecánico id
  let mecLista = await getListaMecanicos()
  let idMecanico
  for (let i = 0; i < mecLista.length; i++) {
    if (mecLista[i].username === req.body.mecanico) {
      idMecanico = mecLista[i].id_funcionario
    }
  }

  //Insert veiculo and/or get veiculoId
  let idVeiculo
  if (data.escolhaVeiculo != "") {
    let veiculoMatricula = data.escolhaVeiculo
    let listaVeiculos = await getListaVeiculos()
    for (let i = 0; i < listaVeiculos.length; i++) {
      if (listaVeiculos[i].matricula === veiculoMatricula) {
        idVeiculo = listaVeiculos[i].id_veiculo
      }
    }
  } else {
    let matriculaVeiculo = data.matricula
    let corVeiculo = data.cor
    let marcaVeiculo = data.marca
    let modeloVeiculo = data.modelo
    let newVeiculo = await adicionarVeiculo(matriculaVeiculo, corVeiculo, marcaVeiculo, modeloVeiculo, mecId)
    idVeiculo = newVeiculo.id_veiculo
  }
  
  //Insert Checklist/Tarefa and/or get checklistId
  let idChecklist
  if (data.escolhaTarefa != "") {
    let tarefaDescricao = data.escolhaTarefa
    let allChecklists = await getChecklists()
    for (let i = 0; i < allChecklists.length; i++) {
      if (allChecklists[i].descricao === tarefaDescricao) {
        idChecklist = allChecklists[i].id_checklist
      }
    }
  } else {
    let descricaoChecklist = data.descricaoChecklist
    let accaoTarefa = data.accao
    let descricaoTarefa = data.descricao
    let obrigatoriedadeTarefa
    if (data.obrigatoriedade === 'on') {
      obrigatoriedadeTarefa = 'sim'
    } else {
      obrigatoriedadeTarefa = 'nao'
    }
    let newChecklistId = await newChecklist(descricaoChecklist)
    idChecklist = newChecklistId.id_checklist
    let newTarefa = await adicionarTarefa(accaoTarefa, descricaoTarefa, obrigatoriedadeTarefa, idChecklist)
    console.log("newTarefa", newTarefa)
  }

  //Insert entrada
  //Function to randomly generate client code
  let result = ''
  let characters = process.env.CHAR_SECRET
  let charactersLength = characters.length
  let length = 24
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  //Get time
  let d = new Date()
  let date = d.getDate()
  let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  let year = d.getFullYear()
  let dataEntrada = year + "-" + month + "-" + date

  let link = result
  console.log("link", link)
  let newEntrada = await addEntrada(dataEntrada, idVeiculo, idChecklist, idCliente, link)
  console.log("newEntrada", newEntrada)
  
  res.redirect('/rececionista/' + req.body.nomeRececionista)
})

//---------------------------------------------------------------------
// Responsavel --------------------------------------------------------
//--------------------------------------------------------------------

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
    } 
    else if (veiculos[i].estado === 'pronto') {
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

  //Get tarefas from reparacao
  for (i = 0; i < veiculosReparacao.length; i++) {
    tarefasVeiculosReparacao.push(await getTarefasVeiculo(veiculosReparacao[i]))
  }

  //Get tarefas from prontos
  for (i = 0; i < veiculosProntos.length; i++) {
    tarefasVeiculosProntos.push(await getTarefasVeiculo(veiculosProntos[i]))
  }

  res.json({tarefasVeiculosEspera, tarefasVeiculosReparacao, tarefasVeiculosProntos})
})

//Gets info about cars without a mecanic and sends it to responsavel.hbs
router.post('/aproletOrcamentos', async (req, res) => {

  const clientEmail = req.body.email
  const matriculaCarro = req.body.matricula

  //Add 0 to the time when needed
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  let currentTime;

  //Get Time
  function getTime() {
    let d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    return  h + ":" + m + ":" + s;
  }

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  
  today = yyyy + '-' + mm + '-' + dd
  currentTime = getTime()

  let idCliente = await getClientIdByEmail(clientEmail)
  idCliente = idCliente.id_cliente

  let idVeiculo = await getVeiculoIdByPlate(matriculaCarro)
  idVeiculo = idVeiculo.id_veiculo

  const submitDetails = await aproletOrcamentoIdVeiculo(today, currentTime, idCliente, idVeiculo)

  res.redirect('/responsavel/' + req.body.nomeAdmin)
})


//---------------------------------------------------------------------
// Admin -------------------------------------------------------------
//---------------------------------------------------------------------

router.get('/admin/:username', (req, res) => {
  const user = req.params.username
  res.render('admin', {user})
})

//Gets info of new checklist
router.post('/addChecklist', async (req, res) => {

  const descricaoChecklist = req.body.descricaoChecklist
  const accao = req.body.accao
  const descricao = req.body.descricao
  const rawObrigatoriedade = req.body.obrigatoriedade
  //Check if obrigatoriedade is yes or no
  if (rawObrigatoriedade === 'on') {
    obrigatoriedade = 'sim'
  } else {
    obrigatoriedade = 'nao'
  }

  //Insert checklist
  let newCl = await newChecklist(descricaoChecklist)
  let id_checklist = newCl.rows[0].id_checklist
  
  //Insert tarefa
  let newTarefa = await adicionarTarefa(accao, descricao, obrigatoriedade, id_checklist)

  res.redirect('/admin/' + req.body.nomeAdmin3)
})


//Add worker
router.post('/adicionarFuncionario', async(req, res) => {
  const nomeFunc = req.body.nome
  const cargoFunc = req.body.cargo
  const idadeFunc = req.body.idade
  const telemovelFunc = req.body.telemovel
  const moradaFunc = req.body.morada
  const emailFunc = req.body.email
  const rawPassword = req.body.password
  const usernameFunc = req.body.username
  
  //encrypt the password
  await bcrypt.genSalt(saltRounds, async function(err, salt) {
    await bcrypt.hash(rawPassword, salt, async function(err, passwordFunc) {
      const novoFunc = await adicionarFuncionario(nomeFunc, cargoFunc, idadeFunc, telemovelFunc, moradaFunc, emailFunc, passwordFunc, usernameFunc)
      console.log("novoFunc", novoFunc)
    })
  })

  res.redirect('/admin/' + req.body.nomeAdmin)
})

//Edit worker
router.post('/editarFuncionario', async(req, res) => {
  const nomeFunc = req.body.nome
  const cargoFunc = req.body.cargo
  const idadeFunc = req.body.idade
  const telemovelFunc = req.body.telemovel
  const moradaFunc = req.body.morada
  const emailFunc = req.body.email
  const rawPassword = req.body.password
  const usernameFunc = req.body.username

  
  const data = await getLogin(usernameFunc)
  const idFunc = data.id_funcionario
  //If true means that the passwoard wasnt changed
  if (rawPassword === data.password) {
    const editedFunc = await editFuncionario(nomeFunc, cargoFunc, idadeFunc, telemovelFunc, moradaFunc, emailFunc, rawPassword, usernameFunc, idFunc)
  } else {
    //encrypt the new password
    await bcrypt.genSalt(saltRounds, async function(err, salt) {
      await bcrypt.hash(rawPassword, salt, async function(err, passwordFunc) {
        const editedFunc2 = await editFuncionario(nomeFunc, cargoFunc, idadeFunc, telemovelFunc, moradaFunc, emailFunc, passwordFunc, usernameFunc, idFunc)
      })
    })
  }

  res.redirect('/admin/' + req.body.nomeAdmin)
})

//Get all workers
router.get('/getFuncionarios', async (req, res) => {
  const funcionarios = await getFuncionario()
  
  res.json(funcionarios)
})

//--------------------------------------------------------------------
// Cliente -----------------------------------------------------------
//--------------------------------------------------------------------

router.get('/cliente/:codigo', async (req, res) => {
  //Check id link is still good
  let link = req.params.codigo
  
  const clienteEspecifico = await getClientByLink(link)  // ID e Link do cliente
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

  //Logic to determine if link is approved and for how long
  if (orcamentos[0].aprovacao === 0) {
    res.render('cliente', { nomeCliente, estado, descricaoOrcamento, valorOrcamento, problemaOrcamento, arrayTarefa })
  } else {
    //Get nows date
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear()
    today = yyyy + '-' + mm + '-' + dd
    
    //Get approved date
    let theOtherDay = new Date(orcamentos[0].dataaprovacao)
    let dd1 = String(theOtherDay.getDate()).padStart(2, '0');
    let mm1 = String(theOtherDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy1 = theOtherDay.getFullYear()
    theOtherDay = yyyy1 + '-' + mm1 + '-' + dd1

    //Check number of days passed
    let date1 = new Date(today)
    let date2 = new Date(theOtherDay)
    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

    if (diffDays > 1) {
      res.send('<h1> Este link já não se encontra ativo</h1>')
    } else {
      res.render('cliente', { nomeCliente, estado, descricaoOrcamento, valorOrcamento, problemaOrcamento, arrayTarefa })
    }
  }
  
})

router.post('/orcamentoAprovado/:link', async (req, res) => {
  
  const urlCode = req.params.link

  //Add 0 to the time when needed
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  let currentTime;

  //Get Time
  function getTime() {
    let d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    return  h + ":" + m + ":" + s;
  }

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  
  today = yyyy + '-' + mm + '-' + dd;
  currentTime = getTime()

  let idCliente = await getClientByLink(urlCode)
  idCliente = idCliente[0].cliente

  const submitDetails = await aproletOrcamento(today, currentTime, idCliente)

  res.render('aproveSuccess')
})

//Dashboard ----------------------------------------------------------
router.get('/dashboard', async (req, res) => {

  const tudo = await getWorkviewInfo()   //   Informacao dos veiculos
  const tarefas = await getTarefasCompletas()

  let numeroTarefasPorID = []

  for (i = 0; i < tarefas.length; i++) {
    numeroTarefasPorID.push(tarefas[i].id_veiculo)
  }

  const idVeiculos = [...new Set(numeroTarefasPorID)]

  let numeroTarefas = []
  let tarefasCompletas = []

  for (i = 0; i < idVeiculos.length; i++) {
    numeroTarefas.push(tarefas.filter(tarefa => tarefa.id_veiculo === idVeiculos[i]).length)
    tarefasCompletas.push(tarefas.filter(tarefa => tarefa.id_veiculo === idVeiculos[i] && tarefa.completa).length)
  }

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