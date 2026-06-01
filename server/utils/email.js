const env = require('../config/env');

const sendEmail = async ({ to, subject, text }) => {
  // Production should replace this with SMTP/SendGrid/SES.
  // Keeping a dev logger makes verification flow functional without fake success.
  if (env.nodeEnv !== 'production' || !env.smtp.host) {
    console.log('\n--- DEV EMAIL ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log('--- END DEV EMAIL ---\n');
    return;
  }

  throw new Error('SMTP email provider is not implemented in this build');
};

module.exports = { sendEmail };
