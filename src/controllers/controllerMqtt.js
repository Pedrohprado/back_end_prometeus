const mqtt = require('mqtt');
const { PrismaClient } = require('@prisma/client');
const { v4: uuiddv4 } = require('uuid');

const prisma = new PrismaClient();

const client = mqtt.connect(process.env.MQTT_CONNECT);

const info = {};
let currentId01 = uuiddv4();
let currentId02 = uuiddv4();

//i can created a new topics for feeding a database
const topics = ['prometeusNewSensorId02', 'prometeusNewSensorId01'];

client.on('connect', () => {
  // client.subscribe('teste/topico');
  client.subscribe(topics[0]);
  client.subscribe(topics[1]);
});

client.on('message', async (topic, payload) => {
  const daysOff = new Date().toUTCString().slice(0, 3);
  const hoursOff = new Date().getHours();

  if (topic === topics[0]) info.prometeus02 = payload.toString();
  if (topic === topics[1]) info.prometeus01 = payload.toString();

  const prometeus02 = await prisma.prometeus.findFirst({
    where: { prometeusCode: 'prometeus02' },
  });

  const prometeus01 = await prisma.prometeus.findFirst({
    where: { prometeusCode: 'prometeus01' },
  });

  if (
    daysOff !== 'Sat' &&
    daysOff !== 'Sun' &&
    hoursOff >= 5 &&
    hoursOff < 17
  ) {
    const second = new Date().getSeconds();
    info.prometeus01 = +info.prometeus01;
    info.prometeus02 = +info.prometeus02;
    console.log(second);

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

    if (prometeus02 && info.prometeus02 >= 70) {
      console.log('existe o 2');
      const newWeldingPrometeus02 = await prisma.welding.create({
        data: {
          capture: currentId02,
          amperagem: info.prometeus02,
          weldingId: prometeus02.id,
        },
      });
    } else {
      currentId02 = uuiddv4();
    }
  }
});
