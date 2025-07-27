let jwt = require("jwt-simple")
let userModel = require('../models/userModel')


const isAuthenticated = async (req, res, next) => {
    // console.log(req.headers);
    let { authorization } = req.headers
    if (!authorization) {
        return res.status(404).send({ message: "Auth token is required" })
    }
    let parts = authorization?.split(" ")
    if (!Array.isArray(parts)
        || parts.length !== 2
        || parts[0] !== "Bearer") {
        return res.status(400).send({ message: "Bearer token is required" })
    }
    try {
        let { email } = jwt.decode(parts[1], process.env.JWT_SECRET)
        let existingUser = await userModel.findOne({ email, verified: true })
        if (existingUser) {
            req.user = existingUser
            return next()
        }
        throw new Error("unauthorized");

    } catch (error) {
        return res.status(401).send({ message: "User is not authenticated" })
    }
}

module.exports = isAuthenticated