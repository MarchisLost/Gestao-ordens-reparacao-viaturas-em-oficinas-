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

module.exports = {
  getLogin,
  getVeiculo,
  getVeiculoFuncionario
}