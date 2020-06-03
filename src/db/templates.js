const db = require('./db')

//Gets wroker data, sends it to /loginAtempt for the login
const getLogin = async (username) => {  
  let data = await db.query(
    'SELECT * FROM funcionario WHERE nome=$1', [username])
    .catch(e => console.error(e.stack))

  return data.rows[0] ? data.rows[0] : null 
}

//Get vehicle info
const getVeiculo = async (matricula) => {
  let data = await db.query(
    'SELECT * FROM veiculo WHERE matricula=$1', [matricula])
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
  getNomeCliente
}