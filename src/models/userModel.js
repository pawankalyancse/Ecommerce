let mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    verified:{
        type: Boolean,
        default: false
    },
    OTP:{
        type: String,
    }
},
{
    timestamps: true,
    collection: 'Users'
})

let userModel = mongoose.model('User',userSchema,'Users')
module.exports = userModel