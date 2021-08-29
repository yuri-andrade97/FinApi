const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost',
    user : 'postgres',
    password : '102323',
    database : 'finapi'
  }
});

module.exports = knex;