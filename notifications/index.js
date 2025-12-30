const nodemailer = require('nodemailer');
// const { createConsumer } = require('../kafka');
const { subscribeToChannel } = require('../redis');
const { SIGNIN_VERIFY, SIGNIN_SUCCESS } = require('../constants');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const handleKafkaMessage = async (payload) => {
    try {
        console.dir(payload);
        const { topic, message } = payload;
        const data = JSON.parse(message.value);
        console.dir(data);
        return sendEmail(data, topic);
    } catch (error) {
        console.error('Failed to parse kafka message with error %s', error.message);
    }
}

const handleRedisSubMessage = async (message, channel) => {
    try {
        const data = JSON.parse(message);
        console.log('☀️  Recieved message from redis pub/sub from channel %s', channel);
        console.log(data);
        return sendEmail(data, channel);
    } catch (error) {
        console.error('Failed to parse kafka message with error %s', error.message);
    }
}

const sendEmail = async (data, topic) => {
    try {
        const mailOptions = {
            from: `Ecommerce Website ${process.env.GMAIL_ID}`,
        }

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
        console.log('✅ Sent mail to %s', mailOptions.to);
    } catch (error) {
        console.error('Failed to send email', error);
    }
}


const onStart = async () => {
    try {
        // await createConsumer("notification-service",
        //     [SIGNIN_VERIFY, SIGNIN_SUCCESS], handleKafkaMessage, true)
        await subscribeToChannel([SIGNIN_VERIFY, SIGNIN_SUCCESS], handleRedisSubMessage);
    } catch (error) {
        console.error(error);
    }

}

onStart();