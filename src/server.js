const express = require('express');
const cors = require('cors');
const { apiRouter } = require('./router/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/thunder/api', apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'endpoint not fould' });
});

const teste = app.listen(1111, process.env.IP_SERVER, () => {
  console.log('running!');
});
