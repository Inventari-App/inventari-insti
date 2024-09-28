import nodemailer from "nodemailer";
import { messages } from "./messages";
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-es.securemail.pro",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // your email
    pass: process.env.MAIL_PASSWORD, // your password
  },
});

const useNodemailer = ({ to, model, reason }) => {
  if (to && model && reason) {
    const message = messages[model][reason];
    if (!message) return console.error("No message has been set yet.");

    return {
      sendEmail: ({ subject, text }) =>
        transporter.sendMail(
          {
            from: '"Controlamaterial" <notifications@controlamaterial.com>',
            to,
            subject,
            text,
          },
          (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
          }
        ),
      message,
    };
  } else {
    console.error("Not enough arguments passed to nodemailer");
  }
};

export { useNodemailer }
