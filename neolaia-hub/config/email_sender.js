const nodemailer = require("nodemailer");
module.exports = {
    async send_mail(email, random_string){
        try{
            const smtpHost = (process.env.HOST_MAIL || '').trim();
            const smtpUser = (process.env.USER_MAIL || '').trim();
            const rawPass = process.env.PASS_MAIL || '';
            const smtpPass = smtpHost.includes('gmail.com') ? rawPass.replace(/\s+/g, '') : rawPass.trim();

            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: 587,
                secure: false,
                auth:{
                    user: smtpUser,
                    pass: smtpPass,
                },
            });

            await transporter.sendMail({
                from: smtpUser,
                to: email,
                subject: 'NEOLAiA Researchers survey: code to be used to fill the form',
                text: `Your OTP password to fill the form is: ${random_string} \n
                The password expires in 1 hour.`,
            });
            console.log('email sent sucessfully');
        } catch (error){
            console.log('SMTP send error:', error && error.code, error && error.responseCode, error && error.response)
            console.log('email not sent')
        }
    }
}