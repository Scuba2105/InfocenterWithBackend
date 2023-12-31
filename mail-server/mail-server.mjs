import nodemailer from "nodemailer";
import { nodemailerAuth } from '../config.mjs';

export function generateNewAccountEmail(email, password){
    return new Promise((resolve,reject) => {

        // Create the nodemailer transport object for sending email.
        const transporter = nodemailer.createTransport({
            host: 'mail.nswhealth.net', // hostname
            port: 587, // port
            secureConnection: false,
            tls: {
                ciphers: 'SSLv3', // tls version
                rejectUnauthorized: true
            },
            auth: {
                user: nodemailerAuth.username,
                pass: nodemailerAuth.password
            }
        });

        // Define the mail options for the email message.
        const mailOptions = {
            from: '"hnect-information-centre@health.nsw.gov.au>', // sender address
            to: email, // list of receivers
            subject: "Welcome to HNECT Information Centre", // Subject line
            text: `An account has been created on your behalf to access the information within the HNECT Information Centre. Your default password is ${password} however 
            it is recommended to change this password as soon as is practicable.`, // plain text body
        };

        // Send the email using the transporter object.
        transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            reject(`The error occurred sending the login email: ${error.message}`);
        } else {
            console.log(`Email sent: ${info.response}`);
            resolve(true);
        }
        });
    })
  }