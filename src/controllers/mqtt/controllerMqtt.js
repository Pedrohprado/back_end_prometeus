const mqtt = require('mqtt');
const { PrismaClient } = require('@prisma/client');
const { v4: uuiddv4 } = require('uuid');

const prisma = new PrismaClient();
const client = mqtt.connect(process.env.MQTT_CONNECT);

const topics = ['prometeusNewSensorId01'];

const sensorDataArrays = {
  prometeusNewSensorId01: [],
};

let currentID = uuiddv4();
let prismaPrometeus;

client.on('connect', async () => {
  await loadPrometeusData();
  client.subscribe(topics);
});

let i = 0;
let status;
let tempofun;

client.on('message', async (topic, payload) => {
  const seconds = new Date().getSeconds();
  const sensorId = topic;

  while (new Date().getSeconds() === seconds) {
    const sensorValue = parseFloat(payload.toString());

    if (!isNaN(sensorValue) && typeof sensorValue === 'number') {
      sensorDataArrays[sensorId].push(sensorValue);
    }
  }

  sendData(sensorDataArrays, sensorId);

  sensorDataArrays[sensorId] = [];
});

async function sendData(sensorDataArrays, sensorId) {
  const sensorMedia =
    sensorDataArrays[sensorId].reduce((acc, item) => acc + item, 0) /
    sensorDataArrays[sensorId].length;
  i++;

  console.log(sensorId, sensorMedia, new Date().getSeconds());

  if (prismaPrometeus && sensorMedia >= 70) {
    const newWelding = await prisma.welding.create({
      data: {
        capture: currentID,
        amperagem: sensorMedia,
        createdAt: new Date(),
        weldingId: prismaPrometeus.id,
      },
    });
    status = 'trabalhando';
    tempofun += 1;
  } else {
    currentID = uuiddv4();
    status = 'parado';
    tempofun = 0;
  }

  //essa parte do codigo tem a finalidade de mostrar o status de funcionamento do prometeus, e quanto tempo ele está
  //funcioando ou não
  if (i === 5) {
    const statusWelding = await prisma.status.update({
      where: {
        prometeusId: prismaPrometeus.id,
      },
      data: {
        status: status,
        tempo: tempofun,
      },
    });
  }
}

async function loadPrometeusData() {
  const slicePrometeus = topics[0].slice(20, 22);
  console.log(slicePrometeus);

  prismaPrometeus = await prisma.prometeus.findFirst({
    where: { prometeusCode: `prometeus${slicePrometeus}` },
  });
}
