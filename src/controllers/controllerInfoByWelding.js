const { PrismaClient } = require('@prisma/client');
const {
  getIntervalWelding,
  sliceSquadWeldings,
  sliceLastProcess,
} = require('../helpers/helperGetIntervalWelding');

const prisma = new PrismaClient();

const lastWeldBeadById = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const prometeus = await prisma.prometeus.findUnique({
        where: { id },
      });

      if (prometeus) {
        const specific = await prisma.welding.findFirst({
          where: {
            weldingId: prometeus.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        console.log(specific);

        if (specific) {
          const beadweld = await prisma.welding.findMany({
            where: {
              capture: specific.capture,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          console.log(beadweld);

          res.status(200).json(beadweld.reverse());
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: 'erro interno no servidor',
    });
  }
};

const listSquadWeldin = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.params.page) || 1;
    const pageSize = parseInt(req.params.pageSize) || 10;

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

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

      let result = sliceSquadWeldings(specific);
      result = result.reverse();
      const paginatedData = result.slice(startIndex, endIndex);
      console.log(paginatedData.length);
      res.status(200).json(paginatedData);
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

const findLastOperations = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const datas = await prisma.welding.findMany({
      where: {
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        prometeus: {
          select: {
            prometeusCode: true,
          },
        },
      },
    });
    console.log(datas);
    const teste = sliceLastProcess(datas);
    const all = teste.reverse().slice(0, 10);
    res.json(all);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: 'erro interno no servidor',
    });
  }
};

module.exports = {
  findLastOperations,
  lastWeldBeadById,
  listSquadWeldin,
  findWeldinBead,
  findWelding,
};
