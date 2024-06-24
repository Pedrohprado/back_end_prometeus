const { broadcastMessage } = require('./websocketService');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

const transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'pedrohprado26@gmail.com',
    pass: 'qzvt vnnd nbfm zltx',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const enviaEmail = async (mensage) => {
  const emailOptions = {
    from: 'mailtrap@demomailtrap.com',
    to: ['eric.souza@ptractor.com.br'],
    subject: 'Status Robo',
    text: mensage,
  };

  await transport.sendMail(emailOptions);
  console.log('email teste');
};

let constAcumulate01 = 0;
let constAcumulate02 = 0;
let constAcumulate03 = 0;
let constAcumulate04 = 0;
let constAcumulate05 = 0;

let statusPrometus01 = {
  prometeus: 'prometeus01',
  status: 'parado',
};

let statusPrometus02 = {
  prometeus: 'prometeus02',
  status: 'parado',
};

let statusPrometus03 = {
  prometeus: 'prometeus03',
  status: 'parado',
};

let statusPrometus04 = {
  prometeus: 'prometeus04',
  status: 'parado',
};

let statusPrometus05 = {
  prometeus: 'prometeus05',
  status: 'parado',
};

async function sendStatusPrometeus01() {
  const dateLastWelding = await prisma.welding.findFirst({
    where: {
      weldingId: 'e6323237-535a-4c48-beef-f3f3510d8c17',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const seconds = new Date().getSeconds();
  const minutes = new Date().getMinutes();

  const minutesLastWelding = dateLastWelding.createdAt.getMinutes();
  const secondsLastWelding = dateLastWelding.createdAt.getSeconds();

  if (minutes === minutesLastWelding || minutes === minutesLastWelding + 1) {
    if (seconds === secondsLastWelding) {
      statusPrometus01.status = 'funcionando';
      constAcumulate01 = 0;
    } else {
      if (Math.abs(seconds - secondsLastWelding) <= 6) {
        statusPrometus01.status = 'funcionando';

        constAcumulate01 = 0;
      } else {
        statusPrometus01.status = 'parado';

        constAcumulate01++;
      }
    }
  } else {
    statusPrometus01.status = 'parado';

    constAcumulate01++;
  }
  console.log(constAcumulate01);

  // if (constAcumulate01 === 60) enviaEmail('Eric, Robô 01 parado mais de 1 minuto!');
}

async function sendInfoPrometeus02() {
  const dateLastWelding = await prisma.welding.findFirst({
    where: {
      weldingId: '599071c0-e513-4783-85ec-d66b7b500998',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const seconds = new Date().getSeconds();
  const minutes = new Date().getMinutes();

  const minutesLastWelding = dateLastWelding.createdAt.getMinutes();
  const secondsLastWelding = dateLastWelding.createdAt.getSeconds();

  if (minutes === minutesLastWelding || minutes === minutesLastWelding + 1) {
    if (seconds === secondsLastWelding) {
      statusPrometus02.status = 'funcionando';
      constAcumulate02 = 0;
    } else {
      if (Math.abs(seconds - secondsLastWelding) <= 10) {
        statusPrometus02.status = 'funcionando';

        constAcumulate02 = 0;
      } else {
        statusPrometus02.status = 'parado';

        constAcumulate02++;
      }
    }
  } else {
    statusPrometus02.status = 'parado';

    constAcumulate02++;
  }
}

async function sendInfoPrometeus03() {
  const dateLastWelding = await prisma.welding.findFirst({
    where: {
      weldingId: '58fa032d-72db-4211-8b00-791ea475a0a9',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const seconds = new Date().getSeconds();
  const minutes = new Date().getMinutes();

  const minutesLastWelding = dateLastWelding.createdAt.getMinutes();
  const secondsLastWelding = dateLastWelding.createdAt.getSeconds();

  if (minutes === minutesLastWelding || minutes === minutesLastWelding + 1) {
    if (seconds === secondsLastWelding) {
      statusPrometus03.status = 'funcionando';
      constAcumulate02 = 0;
    } else {
      if (Math.abs(seconds - secondsLastWelding) <= 10) {
        statusPrometus03.status = 'funcionando';

        constAcumulate02 = 0;
      } else {
        statusPrometus03.status = 'parado';

        constAcumulate02++;
      }
    }
  } else {
    statusPrometus03.status = 'parado';

    constAcumulate02++;
  }
}

function runAll() {
  sendStatusPrometeus01();
  sendInfoPrometeus02();
  sendInfoPrometeus03();

  let status = [];
  status.push(
    statusPrometus01,
    statusPrometus02,
    statusPrometus03,
    statusPrometus04,
    statusPrometus05
  );

  broadcastMessage(status);
  console.log(status);
}

module.exports = {
  runAll,
};
