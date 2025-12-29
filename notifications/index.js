const nodemailer = require('nodemailer');
const { createConsumer } = require('../kafka');
const { SIGNIN_VERIFY, SIGNIN_SUCCESS } = require('../constants');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const sendEmail = async (payload) => {

    try {
        console.dir(payload);
        const { topic, message } = payload;
        const mailOptions = {
            from: `Ecommerce Website ${process.env.GMAIL_ID}`,
        }

        const data = JSON.parse(message.value);

        console.dir(data);

        if (topic === SIGNIN_VERIFY) {
            const { email, otp } = data;
            mailOptions.to = email;
            mailOptions.subject = 'Ecommerce signup OTP';
            mailOptions.text = `Your OTP is ${otp}`
        } else if (topic === SIGNIN_SUCCESS) {
            const { name, email } = data;
            mailOptions.to = email;
            mailOptions.subject = 'Welcome to Ecommerce';
            mailOptions.text = `Hi ${name}! Welcome to Ecommerce Application.`
        } else {
            // Invalid topic for notification service
            return
        }
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Failed to send email', error);
    }
}


const onStart = async () => {
    try {
        await createConsumer("notification-service",
            [SIGNIN_VERIFY, SIGNIN_SUCCESS], sendEmail, true)
    } catch (error) {
        console.error(error);
    }

}

onStart();