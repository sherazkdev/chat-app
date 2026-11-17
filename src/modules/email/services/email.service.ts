import nodeMailer,{ type Transporter } from "nodemailer";

class EmailService {

    private readonly transporter: Transporter;
    constructor(){
        this.transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_NUMBER),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth:{
                user: process.env.SMTP_HOST,
                pass: process.env.SMTP_PASSWORD
            }
        });
    };

    public async sendMail( to:string, subject:string, text:string ):Promise<void> {
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            text
        });
    };

    public async verifyConnection():Promise<Boolean> {
        return this.transporter.verify();   
    };

};
export default EmailService;