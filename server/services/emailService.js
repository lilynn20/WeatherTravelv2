const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
  }
});

exports.sendReminder = (to,city)=>{
  transporter.sendMail({
    from:process.env.EMAIL_USER,
    to,
    subject:"Trip Reminder",
    text:`Reminder for your trip to ${city}`
  });
};