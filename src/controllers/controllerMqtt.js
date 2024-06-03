const mqtt = require('mqtt');
const { PrismaClient } = require('@prisma/client');
const { v4: uuiddv4 } = require('uuid');

const prisma = new PrismaClient();
const client = mqtt.connect(process.env.MQTT_CONNECT);

const info = {};

let currentId01 = uuiddv4();
let currentId02 = uuiddv4();

const topics = ['prometeusNewSensorId01', 'prometeusNewSensorId02'];
let list01 = [];
let list02 = [];

async function lookPrometeus() {
  let p2 = await prisma.prometeus.findFirst({
    where: { prometeusCode: 'prometeus02' },
  });

  let p1 = await prisma.prometeus.findFirst({
    where: { prometeusCode: 'prometeus01' },
  });

  return { p1, p2 };
}

let prismaPrometeus01, prismaPrometeus02;
lookPrometeus().then(({ p1, p2 }) => {
  prismaPrometeus01 = p1;
  prismaPrometeus02 = p2;
});

client.on('connect', () => {
  // client.subscribe('teste/topico');
  if (topics.length >= 2) {
    client.subscribe(topics[0]);
    client.subscribe(topics[1]);
  } else {
    client.subscribe(topics[0]);
    console.log(topics.length);
  }
});

client.on('message', async (topic, payload) => {
  const daysOff = new Date().toUTCString().slice(0, 3);
  const hoursOff = new Date().getHours();
  const second = new Date().getSeconds();

  if (
    daysOff !== 'Sat' &&
    daysOff !== 'Sun' &&
    hoursOff >= 5 &&
    hoursOff < 17
  ) {
    if (topics.length >= 2) {
      if (topic === topics[0]) info.prometeus01 = payload.toString();
      if (topic === topics[1]) info.prometeus02 = payload.toString();

      info.prometeus01 = +info.prometeus01;
      info.prometeus02 = +info.prometeus02;

      //eu estou criando um sistema que pega de segundo em segundo a media do valor recebido
      //
      while (new Date().getSeconds() === second) {
        list01.push(+info.prometeus01);
        list02.push(+info.prometeus02);
      }
      const media01 = list01.reduce((acc, item) => acc + item);
      const media02 = list02.reduce((acc, item) => acc + item);
      let mediaprometeus01 = media01 / list01.length;
      let mediaprometeus02 = media02 / list02.length;
      list01 = [];
      list02 = [];

      console.log(mediaprometeus01, mediaprometeus02);

      if (prismaPrometeus01 && mediaprometeus01 >= 70) {
        console.log(`prometeus 01 ${mediaprometeus01}, ${second}`);
        const newWelding = await prisma.welding.create({
          data: {
            capture: currentId01,
            amperagem: mediaprometeus01,
            weldingId: prismaPrometeus01.id,
          },
        });
      } else {
        currentId01 = uuiddv4();
      }

      if (prismaPrometeus02 && info.prometeus02 >= 70) {
        console.log(`prometeus 02 ${mediaprometeus01}, ${second}`);

        const newWeldingPrometeus02 = await prisma.welding.create({
          data: {
            capture: currentId02,
            amperagem: mediaprometeus02,
            weldingId: prismaPrometeus02.id,
          },
        });
      } else {
        currentId02 = uuiddv4();
      }

      mediaprometeus01 = 0;
      mediaprometeus02 = 0;
    } else {
      //I can kill this else because i nothing use one prometeus
      if (topic === topics[0]) info.prometeus01 = payload.toString();
      info.prometeus01 = +info.prometeus01;

      const prometeus01 = await prisma.prometeus.findFirst({
        where: { prometeusCode: 'prometeus01' },
      });

      if (prometeus01 && info.prometeus01 >= 70) {
        console.log('existe o 1');

        const newWelding = await prisma.welding.create({
          data: {
            capture: currentId01,
            amperagem: info.prometeus01,
            weldingId: prometeus01.id,
          },
        });
      } else {
        currentId01 = uuiddv4();
      }
    }
  }
});
