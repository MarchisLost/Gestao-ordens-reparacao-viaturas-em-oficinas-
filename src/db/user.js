const pool = require('./db')

//Template
const getFuncionario = async (username) => {
  let data = await pool.query(
    'SELECT * FROM funcionario WHERE nome=$1', [username])
    .catch(e => console.error(e.stack))

    return data.rows[0] ? data.rows[0] : null
}

//Gets wroker data, sends it to /loginAtempt for the login
const getLogin = async (username, pass) => {  
  let data = await pool.query(
    'SELECT * FROM funcionario WHERE nome=$1 AND password=$2', [username, pass])
    .catch(e => console.error(e.stack))

    return data.rows[0] ? data.rows[0] : null
}

module.exports = {
  getLogin
}