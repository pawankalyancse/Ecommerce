let userModel = require('../models/userModel')
let generateOTP = require('../utils/otpGenerator')
let sendOTP = require('../utils/mailSender')
let jwt = require('jwt-simple')

const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body
        let existingUser = await userModel.findOne({ email })
        if (existingUser?.verified) {
            return res.status(400).send({ message: "Email is already in use" })
        }
        let freshOTP = generateOTP()
        if (existingUser) {
            await userModel.findOneAndUpdate(
                { email },
                {
                    $set: { name, password, OTP: freshOTP }
                }
            )
        } else {
            await userModel.create({ name, email, password, OTP: freshOTP })
        }
        await sendOTP(email, freshOTP);
        return res.status(200).send({ message: "Registration successful. Please verify your email with the OTP sent" })
    } catch (error) {
        return res.status(500).send({ message: error.message || "Error while processing request" })
    }
}

const verifyUser = async (req, res) => {
    try {
        let { otp, email } = req.body
        let existingUser = await userModel.findOne({ email })
        if (!existingUser) {
            return res.status(404).send({ message: 'Email Not Registered' })
        }
        if (existingUser.verified) return res.status(400).send({ message: "User is already verified" })
        if (otp === existingUser.OTP) {
            await userModel.findOneAndUpdate(
                { email },
                {
                    $set: { verified: true }
                })
            return res.status(200).send({ message: "User verified successfully" })
        }
        return res.status(404).send({ message: "Invalid OTP" })
    } catch (error) {
        return res.status(500).send({ message: error.message || "Error while processing request" })
    }
}

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body
        let existingUser = await userModel.findOne({ email, password, verified: true })
        if (!existingUser) {
            return res.status(401).send({ message: "Invalid credentials" })
        }
        let token = jwt.encode({ email, time: new Date().getMilliseconds() }, process.env.JWT_SECRET)
        return res.status(200).send({ token })
    } catch (error) {
        return res.status(500).send({ message: error.message || "Error while login" })
    }
}

const fetchUsers = async (req, res) => {
    try {
        let users = await userModel.find({}, { password: 0, OTP: 0 })
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({ message: error.message || "Error while fetching" })
    }
}

const fetchUser = async (req, res) => {
    try {
        const { id } = req.params
        let user = await userModel.findById(id)
        return res.status(200).send(user)
    } catch (error) {
        return res.status(500).send({ message: error.message || "Error while fetching" })        
    }
}

// const createUser = async (req, res) => {
//     try {
//         let user = req.body
//         userModel.create(user)
//     } catch (error) {
        
//     }
// }

module.exports = {
    registerUser,
    verifyUser,
    loginUser,
    fetchUsers,
    fetchUser
}
