'use strict';

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

// Create reusable transporter object using SMTP transport.
/*const userEmail = process.env.GMAIL;
const userPass = process.env.GMAILPASS;
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: userEmail,
    pass: userPass,
  },
});*/


const transporter = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  },
}));


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