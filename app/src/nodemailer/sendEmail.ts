import nodemailer from "nodemailer";
import { Message, messages } from "./messages";
import { load } from "ts-dotenv";

const env = load({
  MAIL_USER: String,
  MAIL_PASSWORD: String,
});

const transporter = nodemailer.createTransport({
  host: "smtp-es.securemail.pro",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: env.MAIL_USER, // your email
    pass: env.MAIL_PASSWORD, // your password
  },
});

interface NodemailerProps {
  to: string;
  model: "user" | "invoice";
  reason: "verify" | "reset" | "created" | "status" | "received" | "modified";
}

const useNodemailer = ({ to, model, reason }: NodemailerProps) => {
  const message: Message = messages[model][reason];
  if (!message) {
    console.error("No message has been set yet.");
    return {}
  }

  return {
    sendEmail: async ({ subject, text }: { subject: string; text: string }) =>
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
        },
      ),
    message,
  };
};

export { useNodemailer };
