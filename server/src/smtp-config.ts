import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const transporter = createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: "tankaido4@gmail.com",
        pass: "tan&&&000"
    },
    secure: true
})


export const sendMail = async (mailOptions: Mail.Options) => {
    transporter.sendMail(mailOptions)
}
