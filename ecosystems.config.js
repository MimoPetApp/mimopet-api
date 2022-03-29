module.exports = {
  apps: [
    {
      name: 'mimo-pet',
      script: 'yarn',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
      exp_backoff_restart_delay: 100,
    },
  ],
};