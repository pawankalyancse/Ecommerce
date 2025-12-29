let orderModel = require('../models/orderModel')
let Stripe = require('stripe')
let { sendResponse } = require('../utils/apiUtil')
let stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res, next) => {
    try {
        let order = req.body
        let newOrder = await orderModel.create(order)
        console.log(newOrder);
        let stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: newOrder.items.map(item => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.product.toString(),
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            success_url: "http://localhost:1818/payment?success=true",
            cancel_url: "http://localhost:1818/payment?success=false"
        })
        return sendResponse(res, 200, { session_url: stripeSession.url, sessionId: stripeSession.id })
    } catch (error) {
        next(error)
    }
}

const verifyPaymentStatus = async (req, res, next) => {
    try {
        let { sessionId } = req.params
        let { payment_status } = await stripe.checkout.sessions.retrieve(sessionId)
        return sendResponse(res, 200, { payment_status })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    placeOrder,
    verifyPaymentStatus,
}
