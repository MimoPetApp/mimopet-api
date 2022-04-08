'use strict';

const nodemailer = require('nodemailer');
const userEmail = process.env.GMAIL;
const userPass = process.env.GMAILPASS;

// Create reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: userEmail,
    pass: userPass,
  },
});

module.exports = {
  sendEmail: (from, to, subject, text) => {
    // Setup e-mail data.
    const options = {
      from,
      to,
      subject,
      text,
    };
    // Return a promise of the function that sends the email.
    try {
      return transporter.sendMail(options);
    } catch(err) {
      console.log(err);
      return false
    }
  },
};