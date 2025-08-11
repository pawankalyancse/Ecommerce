let userModel = require('../models/userModel')
let generateOTP = require('../utils/otpGenerator')
let sendOTP = require('../utils/mailSender')
let jwt = require('jsonwebtoken')

const registerUser = async (req, res, next) => {
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
        next(error)
        // return res.status(500).send({ message: error.message || "Error while processing request" })
    }
}

const verifyUser = async (req, res, next) => {
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
        next(error)
        // return res.status(500).send({ message: error.message || "Error while processing request" })
    }
}

const loginUser = async (req, res, next) => {
    try {
        let { email, password } = req.body
        let userDetails = await userModel.findOne({ email, password, verified: true })
        if (!userDetails) {
            return res.status(401).send({ message: "Invalid credentials" })
        }
        let payload = {
            id: userDetails._id,
            role: userDetails.role
        }
        let options = {
            subject: "User login",
            issuer: "Ecommerce website",
            audience: userDetails._id.toString(),
            expiresIn: "1 Hr",
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET, options)
        return res.status(200).send({ token })
    } catch (error) {
        next(error)
        // return res.status(500).send({ message: error.message || "Error while login" })
    }
}

const fetchUsers = async (req, res, next) => {
    try {
        let users = await userModel.find({}, { password: 0, OTP: 0, cart: 0})
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({ message: error.message || "Error while fetching" })
    }
}

const fetchUser = async (req, res, next) => {
    try {
        const { id } = req.params
        let user = await userModel.findById(id, {password: 0, OTP: 0, cart: 0})
        return res.status(200).send(user)
    } catch (error) {
        next(error)
        // return res.status(500).send({ message: error.message || "Error while fetching" })
    }
}

const getCurrentUser = async (req, res, next) => {
    try {
        let user = await userModel.findById(req.user.id, {password: 0, OTP: 0}).populate("cart.product").exec()
        return res.status(200).send(user)
    } catch (error) {
        next(error)
        
    }
}
module.exports = {
    registerUser,
    verifyUser,
    loginUser,
    fetchUsers,
    fetchUser,
    getCurrentUser
}
