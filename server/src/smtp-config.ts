import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const transporter = createTransport({
    port: 465,
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    },
    secure: true
})


export const sendMail = async (mailOptions: Mail.Options) => {
    try{
        transporter.sendMail(mailOptions, (error, emailResponse) => {
            if (error) {
                throw error;
            }
        });
    }catch(error){
        console.log(error)
    }
}



