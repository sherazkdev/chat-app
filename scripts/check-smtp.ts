import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), true);

async function checkSmtp():Promise<void> {
    console.log("Working directory:", process.cwd());
    console.log("SMTP_USER available:", Boolean(process.env.SMTP_USER));
    console.log("SMTP_PASS available:", Boolean(process.env.SMTP_PASS));
    const { default: EmailService } = await import("../src/modules/email/services/email.service");

    const emailService = new EmailService();

    const isConnected = await emailService.verifyConnection();
    if(!isConnected){
        throw new Error("Error: Nodemailer connected failed..");
    };
    return console.log("Success: Nodemailer successfully connected..");
};

checkSmtp().catch( (e) => console.log(e));