const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  // 1) Create a transportor
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    /***  Activate in gmail "less secure app" option  ***/
  });

  // 2) Define the email options

  // 3) Actually send the email
};
