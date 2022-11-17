require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')

const contractsController = require('./controller/contracts.controller');
const jobsController = require('./controller/jobs.controller');
const balancesController = require('./controller/balances.controller');
const adminController = require('./controller/admin.controller');


const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use('/contracts', contractsController);
app.use('/jobs', jobsController);
app.use('/balances', balancesController);
app.use('/admin', adminController);

module.exports = app;
