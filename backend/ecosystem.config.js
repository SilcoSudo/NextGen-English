module.exports = {
  apps: [
    {
      name: 'nextgen-backend',
      script: 'server.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};