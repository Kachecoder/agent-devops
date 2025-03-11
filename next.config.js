const helmet = require('helmet');
module.exports = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: helmet.contentSecurityPolicy() }
      ],
    }];
  }
};