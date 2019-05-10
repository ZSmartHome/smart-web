module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'SmartHome Web',
      script: 'build/server.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 80
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    dev: {
      user: 'pi',
      host: 'raspberrypi',
      ref: 'origin/master',
      repo: 'https://github.com/zeckson/smart-web.git',
      path: '/home/pi/smart-web',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env dev'
    }
  }
};
