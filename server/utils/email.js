const nodemailer = require('nodemailer');
const env = require('../config/env');

const hasSmtpConfig = () => Boolean(env.smtp.host && env.smtp.port);

const createTransporter = () => {
  const auth = env.smtp.user && env.smtp.pass
    ? { user: env.smtp.user, pass: env.smtp.pass }
    : undefined;

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: Number(env.smtp.port),
    secure: env.smtp.secure,
    auth,
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!hasSmtpConfig()) {
    if (env.nodeEnv === 'production') {
      throw new Error('SMTP email configuration is missing');
    }

    console.log('\n--- DEV EMAIL ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log('--- END DEV EMAIL ---\n');
    return;
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    text,
    html,
  });
};

module.exports = { sendEmail };
