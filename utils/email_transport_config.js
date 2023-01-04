const nodemailer = require("nodemailer");

const { TRANSPORT_HOST, TRANSPORT_PORT, TRANSPORT_SERVICE } = process.env


const transportEmail =
    nodemailer.createTransport({

        host: TRANSPORT_HOST,
        port: TRANSPORT_PORT,
        secure: true,
        service: TRANSPORT_SERVICE,
        auth: {
            user: 'jpwork011@gmail.com',
            pass: 'npgzffilvgvdnksm'
        }
    });



async function send_OTP_email(email, OTP) {



    await transportEmail.sendMail({
        from: "jpwork011@gmail.com 📧 JAWAN PAKISTAN",
        to: email,
        subject: "Email Verification OTP",
        html: `<div><h3>Welcome to Jawan Pakistan</h3>
        <p>Please use the following code to verify your email:</p>
        <h1 style="letter-spacing:12px"><b>${OTP}</b></h1></div>`,

    });


}

async function reset_password_email(email, OTP) {



    await transportEmail.sendMail({
        from: "jpwork011@gmail.com 📧 JAWAN PAKISTAN",
        to: email,
        subject: "Reset Password",
        html: `<div>
        <p>Enter the following OTP to reset your password</p>
        <h1 style="letter-spacing:12px"><b>${OTP}</b></h1></div>`,

    });


}

async function send_credentials_email(data) {

    const { username, email, password } = data



    await transportEmail.sendMail({
        from: "jpwork011@gmail.com JAWAN PAKISTAN",
        to: email,
        subject: "Management Credentials",
        html: `<div><h3>Welcome to Jawan Pakistan</h3>
        <p>Use the following credentials to access management account</p>
        <p>Username: <b>${username}</b></p>
        <p>Password: <b>${password}</b></p>
        </div>`,

    });


}


async function send_verify_confirmation_email(email) {



    await transportEmail.sendMail({
        from: "jawantechpk@gmail.com 📧 <JAWAN PAKISTAN>",
        to: email,
        subject: "JawanPakistan Student Registration Test Email",
        html: ` 
            'Email verify Successfully ',
            'Thanks for connecting for Us'
            `
    })


}


module.exports = { transportEmail, send_OTP_email, send_verify_confirmation_email, send_credentials_email, reset_password_email }