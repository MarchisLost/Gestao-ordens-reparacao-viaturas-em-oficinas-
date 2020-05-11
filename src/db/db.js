const { Sequelize } = require('sequelize');

//passing the necessary information for the postgresql bd
module.exports = new Sequelize('postgres://yzeyqail:9vy3_8okrryjz87bskwiEC_50FQkTSv2@kandula.db.elephantsql.com:5432/yzeyqail')