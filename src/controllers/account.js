const knex = require('../connection');
const { handleUpdateBalance } = require('../utils/handleUpdateBalance');

const registerAccount = async (req, res) => {
  const { nome, cpf, senha } = req.body;

  try {
    const accountAlreadyExists = await knex('account').select('*').where('cpf', cpf);

    if (accountAlreadyExists.length > 0) {
      return res.status(400).json('CPF já cadastrado!');
    }

    const registeringAccount = await knex('account').insert({nome, cpf, senha}).debug();
    
    if (registeringAccount.rowCount < 1) {
      return res.status(400).json('Não foi possível cadastrar a conta');
    }
    
    return res.status(201).json('Conta criada com sucesso!');
  } catch (error) {
    return res.status(400).json({error: "ERRO NA REQUISIÇÃO PARA O BANCO DE DADOS"});
  }
};

const getStatement = async (req, res) => {
  const { customer } = req;

  try {
    const lookingStatement = await knex('transactions').select('*').where('usuario_cpf', customer.cpf);

    if (!lookingStatement) {
      return res.status(400).json('Usuário não possui transações')
    }

    return res.json(lookingStatement);
  } catch (error) {
    console.log(error)
    return res.status(400).json({error: "ERRO NA REQUISIÇÃO PARA O BANCO DE DADOS"});
  }
};

const getStatementForDate = async (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  // buscando na tabela de transações, pela data informada na query
  try {
    const getStatment = await knex('transactions').select('*').where('data_hora', date);
    return res.json(getStatment);
  } catch (error) {
    console.log(error)
    return res.status(400).json({error: "ERRO NA REQUISIÇÃO PARA O BANCO DE DADOS"});
  }
};

const getAccount = async (req, res) => {
  const { customer } = req;

  const dataAccount = {
    "nome": customer.nome,
    "cpf": customer.cpf,
    "senha": customer.senha,
    "saldo": customer.saldo
  }

  return res.json(dataAccount);
};

const deposit = async (req, res) => {
  const { descricao, montante, tipo } = req.body;
  const { customer } = req;

  try {
    const deposit = await knex('transactions').insert({
      usuario_cpf: customer.cpf,
      tipo,
      montante,
      descricao,
      data_hora: new Date()
    }).debug()

    if (deposit.rowCount === 0) {
      return res.status(400).json('Não foi possível realizar o deposito');
    }
 
    // Atualizando o saldo após receber o deposito.
    const newBalance = await handleUpdateBalance(tipo, montante, customer);
    
    const updateBalance = await knex('account')
      .update({saldo: newBalance})
      .where('cpf', customer.cpf);

    return res.status(201).json('Deposito realizado!');
  } catch (error) {
    console.log(error)
    return res.status(400).json({error: "ERRO NA REQUISIÇÃO PARA O BANCO DE DADOS"});
  }
};

const withdraw = async (req, res) => {
  const { descricao, montante, tipo } = req.body;
  const { customer } = req;

  try {
    
    if (montante > customer.saldo) {
      return res.status(400).json('Valor do saque maior que o saldo em conta');
    }

    const deposit = await knex('transactions').insert({
      usuario_cpf: customer.cpf,
      tipo,
      montante,
      descricao,
      data_hora: new Date()
    }).debug()

    if (deposit.rowCount === 0) {
      return res.status(400).json('Não foi possível realizar o saque');
    }
 
    // Atualizando o saldo após o saque.
    const newBalance = await handleUpdateBalance(tipo, montante, customer);
    
    const updateBalance = await knex('account')
      .update({saldo: newBalance})
      .where('cpf', customer.cpf);

    return res.status(201).json('Saque realizado!');
  } catch (error) {
    console.log(error)
    return res.status(400).json({error: "ERRO NA REQUISIÇÃO PARA O BANCO DE DADOS"});
  }
};

const updateDataAccount = async (req, res) => {
  const { customer } = req;
  const { 
    nome,
    senha
   } = req.body;

  // Atualizando dado(s) da conta
 try {
  const updateData = await knex('account')
  .update({ nome, senha }).
  where('cpf', customer.cpf);

  if (updateData < 1) {
    return res.status(400).json('Não foi possível realizar a atualização.');
  }

  return res.json('Atualização concluida com sucesso.')
 } catch (error) {
  console.log(error)
  return res.status(400).json({error: "ERRO NA REQUISIÇÃO PARA O BANCO DE DADOS"});
 }
};

const deleteAccount = async (req, res) => {
  const { customer } = req;

  try {
    const deletingAccount = await knex('account').delete().where('cpf', customer.cpf);

    if (deletingAccount < 1) {
      return res.status(400).json('Não foi possível deletar a conta.');
    }

    return res.json('Conta deletada com sucesso!');
  } catch (error) {
    console.log(error)
    return res.status(400).json({error: "ERRO NA REQUISIÇÃO PARA O BANCO DE DADOS"});
  }
}

module.exports = {
  registerAccount,
  getStatement,
  getStatementForDate,
  getAccount,
  deposit,
  withdraw,
  updateDataAccount,
  deleteAccount
}