const db = require('./db')

//Gets wroker data, sends it to /loginAtempt for the login
const getLogin = async (username) => {  
  let data = await db.query(
    'SELECT * FROM funcionario WHERE username=$1', [username])
    .catch(e => console.error(e.stack))

  return data.rows[0] ? data.rows[0] : null 
}

//Get vehicles for x worker using id
const getVeiculoFuncionario = async (id) => {
  let data = await db.query(
    'SELECT * FROM veiculo WHERE id_funcionario=$1', [id])
    .catch(e => console.error(e.stack))

    return data.rows ? data.rows : null
}

//Get client by his id
const getClient = async (id) => {
  let data = await db.query(
    'SELECT * FROM cliente WHERE id_cliente=$1', [id])
    .catch(e => console.error(e.stack))

    return data.rows ? data.rows : null
}

//Get orçamento by client id
const getOrcamento = async (id) => {
  let data = await db.query(
    'SELECT * FROM orcamento WHERE id_cliente=$1', [id])
    .catch(e => console.error(e.stack))

    return data.rows ? data.rows : null
}

// ---------------------------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------------------------
const getWorkviewInfo = async () => {
  let data = await db.query(
    "SELECT nome, matricula FROM funcionario, veiculo, entrada WHERE veiculo.id_funcionario = funcionario.id_funcionario and veiculo.id_veiculo = entrada.id_veiculo order by entrada.data_entrada desc limit 4")
    .catch(e => console.error(e.stack))

    return data.rows ? data.rows : null
}

const getTarefasCompletas = async () => {
  let data = await db.query(
    "select id_veiculo, id_tarefa, completa from tarefa left join checklist on tarefa.id_checklist = checklist.id_checklist left join entrada on checklist.id_checklist = entrada.id_checklist group by data_entrada,id_veiculo, id_tarefa order by data_entrada desc"
    )
    .catch(e => console.error(e.stack))

    return data.rows ? data.rows : null
}

// ---------------------------------------------------------------------------------------------
// Cliente
// ---------------------------------------------------------------------------------------------

const getClientByLink = async (link) => {
  let data = await db.query(
    "select entrada.cliente, entrada.link from entrada where entrada.link = $1", [link]
  )
  .catch(e => console.error(e.stack))

  return data.rows ? data.rows : null
}

const getNomeCliente = async (id) => {
  let data = await db.query(
    "select nome from cliente where cliente.id_cliente = $1", [id]
  )
  .catch(e => console.error(e.stack))

  return data.rows ? data.rows : null
}

const getdetalhesOrcamento = async(id) => {
  let data = await db.query(
    //"select cliente.id_cliente, descricao, estado, nome, valor from orcamento, veiculo, cliente where orcamento.id_veiculo = veiculo.id_veiculo and orcamento.id_cliente = $1", [id]
    "select orcamento.id_cliente, orcamento.id_veiculo, valor,  descricao from orcamento where orcamento.id_cliente = $1", [id]
  )
  .catch(e => console.error(e.stack))

    return data.rows ? data.rows : null
}

const getProblemas = async (id) => {
  let data = await db.query(
    "select problema.descricao, entrada.cliente from problema, entrada where problema.id_entrada = entrada.id_entrada and entrada.cliente = $1", [id]
  )
  .catch(e => console.error(e.stack))

    return data.rows ? data.rows : null
}

const getListaTarefas = async (id) => {
  let data = await db.query(
    "select tarefa.descricao from tarefa,entrada,checklist where  entrada.id_checklist = checklist.id_checklist  and tarefa.id_checklist = checklist.id_checklist and entrada.cliente = $1", [id]
  )
  .catch(e => console.error(e.stack))

  return data.rows ? data.rows : null
}

const getVeiculoById = async (id) => {
  let data = await db.query(
    "select estado from veiculo, orcamento where orcamento.id_veiculo = veiculo.id_veiculo and orcamento.id_cliente = $1", [id]
  )
  .catch(e => console.error(e.stack))

  return data.rows ? data.rows : null
}

const aprovarOrcamento = async (date, time, id) => {
  let data = await db.query(
    "update orcamento set dataaprovacao = $1, horaaprovacao = $2, aprovacao = 1 WHERE id_cliente = $3", [date, time, id]
  )
  .catch(e => console.error(e.stack))

  return data.rows ? data.rows : null
}

const createCliente = async () => {
  //Function to randomly generate client code
  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // console.log(`http://localhost:3000/cliente/${makeid(20)}`);
}


// ---------------------------------------------------------------------------------------------
// Mecanico
// ---------------------------------------------------------------------------------------------

const getVeiculosByFuncionario = async (username) => {
  let data = await db.query(
    "select id_veiculo, matricula, estado from veiculo, funcionario where veiculo.id_funcionario = funcionario.id_funcionario and funcionario.username =$1", [username])
    .catch(e => console.error(e.stack))

    return data.rows ? data.rows : null
}

const getTarefasVeiculo = async (id) => {
  let data =await db.query(
    "select id_veiculo, tarefa.descricao from tarefa, checklist, entrada where tarefa.id_checklist = checklist.id_checklist and entrada.id_checklist = checklist.id_checklist and id_veiculo = $1", [id]
  )
  .catch(e => console.error(e.stack))

  return data.rows ? data.rows : null
}

const getTarefasIncompletas = async (id) => {
  let data =await db.query(
    "select id_veiculo, id_entrada ,tarefa.descricao, tarefa.completa, tarefa.id_tarefa  from tarefa, checklist, entrada  where tarefa.id_checklist = checklist.id_checklist  and entrada.id_checklist = checklist.id_checklist and id_veiculo = $1 and tarefa.completa = 0", [id]
  )
  .catch(e => console.error(e.stack))

  return data.rows ? data.rows : null
}

const getVeiculo = async (id, estado) => {
  let data = await db.query(
    "update veiculo set estado = $1 WHERE id_veiculo=$2", [estado, id])
    .catch(e => console.error(e.stack))

    return data.rows[0] ? data.rows[0] : null
}

const markTaskAsCompleted = async (idTarefa) => {
  let data = await db.query(
    "update tarefa set completa = 1 WHERE id_tarefa=$1", [idTarefa])
    .catch(e => console.error(e.stack))

    return data.rows[0] ? data.rows[0] : null 
}

const getIdChecklistByEntrada = async (idEntrada) => {
  let data = await db.query(
    "select id_checklist from entrada where id_entrada = $1", [idEntrada])
    .catch(e => console.error(e.stack))

    return data.rows[0] ? data.rows[0] : null 
}

const adicionarTarefa = async (acao, descricao, obrigatorio, idChecklist, newID) => {
  let data = await db.query(
    "INSERT INTO tarefa (acao, descricao, obrigatorio, id_checklist, completa, id_tarefa) VALUES ($1, $2, $3, $4, 0, $5)", [acao, descricao, obrigatorio, idChecklist, newID])
    .catch(e => console.error(e.stack))

    return data.rows[0] ? data.rows[0] : null 
}

const maxIDTarefa = async () => {
  let data = await db.query(
    "select max(id_tarefa) from tarefa")
    .catch(e => console.error(e.stack))

    return data.rows[0] ? data.rows[0] : null 
}


// ---------------------------------------------------------------------------------------------
// Rececionista
// ---------------------------------------------------------------------------------------------

const getListaVeiculos = async () => {
  let data = await db.query(
    "select id_veiculo, estado, matricula from veiculo")
    .catch(e => console.error(e.stack))

    return data.rows
}

const getListaMecanicos = async () => {
  let data = await db.query(
    "select username from funcionario where cargo = 'mecanico'")
    .catch(e => console.error(e.stack))

    return data.rows
}

const maxIDVeiculo = async () => {
  let data = await db.query(
    "select max(id_veiculo) from veiculo")
    .catch(e => console.error(e.stack))

    return data.rows[0] ? data.rows[0] : null 
}

const getFuncionarioByUsername = async (username) => {
  let data = await db.query(
    "select id_funcionario from funcionario where username = $1", [username])
    .catch(e => console.error(e.stack))

    return data.rows[0] ? data.rows[0] : null 
}

const adicionarVeiculo = async (newID, matricula, cor, marca, modelo, funcionario) => {
  let data = await db.query(
    "INSERT INTO veiculo (id_veiculo, matricula, cor, marca, modelo, estado,  id_funcionario) VALUES ($1, $2, $3, $4, $5, 'em espera', $6)", [newID, matricula, cor, marca, modelo, funcionario])
    .catch(e => console.error(e.stack))

    return data.rows[0] ? data.rows[0] : null 
}


module.exports = {
  getLogin,
  getVeiculo,
  getVeiculoFuncionario,
  getClient,
  getOrcamento,
  getWorkviewInfo,
  getTarefasCompletas,
  getdetalhesOrcamento,
  getProblemas,
  getListaTarefas,
  getClientByLink,
  getVeiculoById,
  getNomeCliente,
  getVeiculosByFuncionario,
  getTarefasVeiculo,
  getTarefasIncompletas,
  markTaskAsCompleted,
  getIdChecklistByEntrada,
  adicionarTarefa,
  maxIDTarefa,
  aprovarOrcamento,
  getListaVeiculos,
  getListaMecanicos,
  adicionarVeiculo,
  maxIDVeiculo,
  getFuncionarioByUsername
}