module.exports = {
  apps: [
    {
      name: 'mqtt-controller-1',
      script: 'src/controllers/mqtt/controllerMqtt.js',
      watch: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
    {
      name: 'mqtt-controller-2',
      script: 'src/controllers/mqtt/controllerMqtt02.js',
      watch: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
    {
      name: 'mqtt-controller-3',
      script: 'src/controllers/mqtt/controllerMqtt03.js',
      watch: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],
};
