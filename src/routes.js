const express = require('express');
const routes = express();

const account = require('./controllers/account');

const verifyIfExistsAccountCPF = require('./middleware/index');

routes.post("/", account.registerAccount);
routes.get("/statement", verifyIfExistsAccountCPF, account.getStatement);
routes.get("/statement/date", verifyIfExistsAccountCPF, account.getStatementForDate);
routes.get("/account", verifyIfExistsAccountCPF, account.getAccount);
routes.post("/deposit", verifyIfExistsAccountCPF, account.deposit);
routes.post("/withdraw", verifyIfExistsAccountCPF, account.withdraw);
routes.put("/updateAccount", verifyIfExistsAccountCPF, account.updateDataAccount);
routes.delete("/deleteAccount", verifyIfExistsAccountCPF, account.deleteAccount);

module.exports = routes;