let mongoose = require("mongoose")

let itemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
})

let orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User"
    },
    items: {
        type: [itemSchema],
        required: true
    },
    fullAddress: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMode:{
        type : String,
        enum : ["COD", "Stripe"],
        required : true
    },
    paymentStatus: {
        type : String,
        enum : ["Paid", "Pending"],
        default : "Pending"
    },
    totalAmount : {
        type : Number,
        required : true
    }
}, {
    timestamps : true,
    collection : "Orders"
})

let orderModel = mongoose.model('Order', orderSchema, 'Orders')
module.exports = orderModel