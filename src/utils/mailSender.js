const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const sendOTP = async (email, OTP) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: `Ecommerce Website ${process.env.GMAIL_ID}`,
            to: email,
            subject: 'Ecommerce signup OTP',
            text: `Your OTP is ${OTP}`
        }
        const callback = (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve()
            }
        }
        transporter.sendMail(mailOptions, callback);
    })
}

module.exports = sendOTP


