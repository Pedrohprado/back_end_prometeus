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

let statusPrometeus = {
  prometeus01: 'parado',
  prometeus02: 'parado',
  prometeus03: 'parado',
  prometeus04: 'parado',
  prometeus05: 'parado',
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
      statusPrometeus.prometeus01 = 'funcionando';
      constAcumulate01 = 0;
    } else {
      if (Math.abs(seconds - secondsLastWelding) <= 6) {
        statusPrometeus.prometeus01 = 'funcionando';

        constAcumulate01 = 0;
      } else {
        statusPrometeus.prometeus01 = 'parado';

        constAcumulate01++;
      }
    }
  } else {
    statusPrometeus.prometeus01 = 'parado';

    constAcumulate01++;
  }
  console.log(constAcumulate01);

  if (constAcumulate01 === 60)
    enviaEmail('Eric, Robô 01 parado mais de 1 minuto!');
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
      statusPrometeus.prometeus02 = 'funcionando';
      constAcumulate02 = 0;
    } else {
      if (Math.abs(seconds - secondsLastWelding) <= 6) {
        statusPrometeus.prometeus02 = 'funcionando';

        constAcumulate02 = 0;
      } else {
        statusPrometeus.prometeus02 = 'parado';

        constAcumulate02++;
      }
    }
  } else {
    statusPrometeus.prometeus02 = 'parado';

    constAcumulate02++;
  }
}

function runAll() {
  sendStatusPrometeus01();
  sendInfoPrometeus02();

  broadcastMessage(statusPrometeus);
  console.log(statusPrometeus);
}

module.exports = {
  runAll,
  //   sendInfoPrometeus02
};
