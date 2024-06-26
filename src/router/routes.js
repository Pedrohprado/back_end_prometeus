const express = require('express');
const {
  createdNewProcess,
  getAllProcess,
} = require('../controllers/controllerNewProccess');
const {
  findWelding,
  findWeldinBead,
  listSquadWeldin,
  lastWeldBeadById,
  findLastOperations,
} = require('../controllers/controllerInfoByWelding');
const { getCicleWorkOrStop } = require('../controllers/controllerServiceCycle');

const apiRouter = express.Router();

//rotas para verificar e criar novos processos
apiRouter.post('/newprocess', createdNewProcess);
apiRouter.get('/allprocess', getAllProcess);

//rotas para verificar soldas de cada processo
apiRouter.get('/weldings/:id/:first/:last', findWelding);
apiRouter.get('/specific/:id/:bead', findWeldinBead);
apiRouter.get('/prometeus/weldings/:id/:page/:pageSize', listSquadWeldin);
//this route get a last bead by id, use for graph home
apiRouter.get('/lastweldbead/:id', lastWeldBeadById);

//this route get a lasts process i use for table in homepage
apiRouter.get('/lastprocessweld', findLastOperations);

//rotas para verificar o controle de ciclo de serviço de cada prometeus
apiRouter.get('/servicecycle/:id/:first/:last', getCicleWorkOrStop);

module.exports = { apiRouter };
