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
const { getCicleWorkOrStop } = require('../controllers/controllerServiceCycle');

const apiRouter = express.Router();

//rotas para verificar soldas de cada processo
apiRouter.get('/weldings/:id/:first/:last', findWelding);
apiRouter.get('/specific/:id/:bead', findWeldinBead);
apiRouter.get('/prometeus/weldings/:id/:page/:pageSize', listSquadWeldin);

//rotas para verificar e criar novos processos
apiRouter.post('/newprocess', createdNewProcess);
apiRouter.get('/allprocess', getAllProcess);

//rotas para verificar o controle de ciclo de serviço de cada prometeus
apiRouter.get('/servicecycle/:id/:first/:last', getCicleWorkOrStop);

module.exports = { apiRouter };
