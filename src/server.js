const express = require('express');
const cors = require('cors');
const { apiRouter } = require('./router/routes');

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/thunder/api', apiRouter);

server.use((req, res) => {
  res.status(404).json({ error: 'endpoint not fould' });
});

server.listen(8080, () => {
  console.log('running!');
});
