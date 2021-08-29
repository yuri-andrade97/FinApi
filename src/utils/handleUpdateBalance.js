const knex = require('../connection');

async function handleUpdateBalance(tipo, montante, customer) {
  let updatedBalance;

  if (tipo === 'credit') {
    return updatedBalance = customer.saldo + montante; 
  }

  if (tipo === 'withdraw') {
    return updatedBalance = customer.saldo - montante; 
  }
}

module.exports = {
  handleUpdateBalance
}