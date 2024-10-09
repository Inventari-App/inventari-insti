var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from "nodemailer";
import { messages } from "./messages";
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
const useNodemailer = ({ to, model, reason }) => {
    const message = messages[model][reason];
    if (!message) {
        console.error("No message has been set yet.");
        return {};
    }
    return {
        sendEmail: (_a) => __awaiter(void 0, [_a], void 0, function* ({ subject, text }) {
            return transporter.sendMail({
                from: '"Controlamaterial" <notifications@controlamaterial.com>',
                to,
                subject,
                text,
            }, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("Message sent: %s", info.messageId);
            });
        }),
        message,
    };
};
export { useNodemailer };
