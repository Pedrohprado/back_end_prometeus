const mqtt = require('mqtt');
const { PrismaClient } = require('@prisma/client');
const { v4: uuiddv4 } = require('uuid');
const prisma = new PrismaClient();

const mqttclient = mqtt.connect(process.env.MQTT_CONNECT);

const topics = ['prometeusNewSensorId01'];

const sensorDataArrays = {
  prometeusNewSensorId01: [],
};

let currentID = uuiddv4();
let prismaPrometeus;

mqttclient.on('connect', async () => {
  await loadPrometeusData();
  mqttclient.subscribe(topics);
});

mqttclient.on('message', async (topic, payload) => {
  const seconds = new Date().getSeconds();
  const sensorId = topic;

  while (new Date().getSeconds() === seconds) {
    const sensorValue = parseFloat(payload.toString());

    if (!isNaN(sensorValue) && typeof sensorValue === 'number') {
      sensorDataArrays[sensorId].push(sensorValue);
    }
  }

  await sendData(sensorDataArrays, sensorId);

  sensorDataArrays[sensorId] = [];
});

async function sendData(sensorDataArrays, sensorId) {
  const sensorMedia =
    sensorDataArrays[sensorId].reduce((acc, item) => acc + item, 0) /
    sensorDataArrays[sensorId].length;

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
  } else {
    currentID = uuiddv4();
  }
}

async function loadPrometeusData() {
  const slicePrometeus = topics[0].slice(20, 22);
  console.log(slicePrometeus);

  prismaPrometeus = await prisma.prometeus.findFirst({
    where: { prometeusCode: `prometeus${slicePrometeus}` },
  });
}
