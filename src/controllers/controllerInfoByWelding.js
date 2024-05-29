const { PrismaClient } = require('@prisma/client');
const {
  getIntervalWelding,
  sliceSquadWeldings,
} = require('../helpers/helperGetIntervalWelding');

const prisma = new PrismaClient();

const listSquadWeldin = async (req, res) => {
  try {
    const { id } = req.params;
    const prometeus = await prisma.prometeus.findUnique({
      where: { id },
    });

    if (prometeus) {
      const specific = await prisma.welding.findMany({
        where: {
          weldingId: prometeus.id,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      sliceSquadWeldings(specific);
      res.status(200).json(specific);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: 'erro interno no servidor',
    });
  }
};

const findWeldinBead = async (req, res) => {
  try {
    const { id, bead } = req.params;

    const prometeus = await prisma.prometeus.findUnique({
      where: { id },
    });

    if (prometeus) {
      const specific = await prisma.welding.findMany({
        where: {
          weldingId: prometeus.id,
          capture: bead,
        },
      });

      res.status(200).json(specific);
    } else {
      res.status(404).json({
        error: 'Nenhum prometeus encontrado',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: 'erro interno no servidor',
    });
  }
};

const findWelding = async (req, res) => {
  try {
    const { id, first, last } = req.params;
    const process = await prisma.prometeus.findUnique({
      where: { id },
    });

    if (process) {
      const welding = await prisma.welding.findMany({
        where: {
          weldingId: process.id,
        },
      });

      const interval = getIntervalWelding(welding, first, last);

      if (interval) res.status(200).json(interval);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: 'erro interno no servidor',
    });
  }
};

module.exports = {
  listSquadWeldin,
  findWeldinBead,
  findWelding,
};
