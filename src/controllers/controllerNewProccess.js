const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllProcess = async (req, res) => {
  try {
    const allProcess = await prisma.prometeus.findMany();

    if (allProcess) res.status(200).json(allProcess);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: 'erro interno no servidor',
    });
  }
};

const createdNewProcess = async (req, res) => {
  try {
    const info = req.body;
    if (info) {
      const newProcess = await prisma.prometeus.create({
        data: info,
      });
      console.log(newProcess);
      res.status(201).json({
        message: 'processo criado com sucesso',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: 'erro interno no servidor',
    });
  }
};

module.exports = {
  getAllProcess,
  createdNewProcess,
};
