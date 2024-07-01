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
  const { ids, first, last } = req.params;

  const idPrometeus = ids.split(',');

  const results = [];

  for (const id of idPrometeus) {
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

      if (weldings.length > 0) {
        const weldingBetweenDate = getIntervalWelding(weldings, first, last);
        const weldingBySquads = sliceSquadWeldings(weldingBetweenDate);
        const reverseWelding = weldingBySquads.reverse();
        const weldingCycle = someMinutesWorkorStopping(reverseWelding);

        results.push({
          prometeus: prometeus.prometeusCode,
          weldingCycle: weldingCycle,
        });
      }
    }
  }
  res.status(200).json(results);
};

module.exports = {
  getCicleWorkOrStop,
};
