const { PrismaClient } = require('@prisma/client');
const {
  getIntervalWelding,
  sliceSquadWeldings,
} = require('../helpers/helperGetIntervalWelding');

const {
  someMinutesWorkorStopping,
} = require('../helpers/helperCountServiceCycle');

const prisma = new PrismaClient();

const getCicleWorkOrStop = async (req, res) => {
  const { id, first, last } = req.params;

  const prometeus = await prisma.prometeus.findUnique({
    where: {
      id,
    },
  });

  if (prometeus) {
    const weldings = await prisma.welding.findMany({
      where: {
        weldingId: prometeus.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (weldings) {
      const weldingBetweenDate = getIntervalWelding(weldings, first, last);
      const weldingBySquads = sliceSquadWeldings(weldingBetweenDate);
      const reverseWelding = weldingBySquads.reverse();
      const weldingCycle = someMinutesWorkorStopping(reverseWelding);
      res.status(200).json(weldingCycle);
    }
  }
};

module.exports = {
  getCicleWorkOrStop,
};
