const knex = require('../connection');

const verifyIfExistsAccountCPF = async (req, res, next) => {
  const { cpf } = req.headers;

 try {
  const customer = await knex('account').select('*').where('cpf', cpf).first();

  if (!customer) {
    return res.status(400).json({ error: "Cliente não encontrado!" });
  }

  req.customer = customer;
  return next();
 } catch (error) {
  return res.status(400).json({error: "ERRO"});
 }
};

module.exports = verifyIfExistsAccountCPF;