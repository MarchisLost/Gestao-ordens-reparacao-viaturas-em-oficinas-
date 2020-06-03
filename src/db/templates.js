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
// TEMPORARY FUNCTIONS
// ---------------------------------------------------------------------------------------------

const getWorkviewInfo = async () => {
  let data = await db.query(
    "SELECT nome, matricula FROM funcionario, veiculo, entrada WHERE veiculo.id_funcionario = funcionario.id_funcionario and veiculo.id_veiculo = entrada.id_veiculo order by entrada.data_entrada desc limit 4")
    .catch(e => console.error(e.stack))

    return data.rows ? data.rows : null
}

const getTarefas = async () => {
  let data = await db.query(
    "select id_veiculo, id_tarefa, completa from tarefa left join checklist on tarefa.id_checklist = checklist.id_checklist left join entrada on checklist.id_checklist = entrada.id_checklist group by data_entrada,id_veiculo, id_tarefa order by data_entrada desc"
    )
    .catch(e => console.error(e.stack))

    return data.rows ? data.rows : null
}

module.exports = {
  getLogin,
  getVeiculo,
  getVeiculoFuncionario,
  getClient,
  getOrcamento,
  getWorkviewInfo,
  getTarefas
}