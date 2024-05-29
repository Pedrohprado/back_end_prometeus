const express = require('express');
const {
  createdNewProcess,
  getAllProcess,
} = require('../controllers/controllerNewProccess');
const {
  findWelding,
  findWeldinBead,
  listSquadWeldin,
} = require('../controllers/controllerInfoByWelding');

const apiRouter = express.Router();

//rotas para verificar soldas de cada processo
apiRouter.get('/weldings/:id/:first/:last', findWelding);
apiRouter.get('/specific/:id/:bead', findWeldinBead);
apiRouter.get('/prometeus/weldings/:id', listSquadWeldin);

//rotas para verificar e criar novos processos
apiRouter.post('/newprocess', createdNewProcess);
apiRouter.get('/allprocess', getAllProcess);

module.exports = { apiRouter };
