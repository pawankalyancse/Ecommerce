let jwt = require("jsonwebtoken")
let userModel = require('../models/userModel')
const MS_IN_ONE_DAY = 24 * 60 * 60 * 1000


const isAuthenticated = async (req, res, next) => {
    // console.log(req.headers);
    let { authorization } = req.headers
    if (!authorization) {
        return res.status(400).send({ message: "Auth token is required" })
    }
    let splits = authorization?.split(" ")
    if (!Array.isArray(splits)
        || splits.length !== 2
        || splits[0] !== "Bearer") {
        return res.status(400).send({ message: "Bearer token is required" })
    }
    try {
        let [_, token] = splits 
        let {email} = jwt.verify(token, process.env.JWT_SECRET)
        let existingUser = await userModel.findOne({email, verified : true})
        if (!existingUser) {
            throw new Error("User is not authenticated");
        }
        req.user = existingUser
        next()
    } catch (error) {
        return res.status(401).send({ message: "User is not authenticated" })
    }
}

module.exports = isAuthenticated