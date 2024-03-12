import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const transporter = createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    },
    secure: true
})


export const sendMail = async (mailOptions: Mail.Options) => {
    transporter.sendMail(mailOptions)
}
