module.exports = {
  apps: [
    {
      name: "wind-tech-pro-backend",
      exec_mode: "fork",
      instances: 1, // Or a number of instances
      script: "./dist/src/main.js",
      args: "start:prod",
      port: 3000,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

