let orderRouter = require('express').Router()
let {placeOrder, verifyPaymentStatus} = require('../controllers/ordersControllers')
let isAuthenticated = require('../middleware/isAuthenticated')

orderRouter.post("/checkout", isAuthenticated, placeOrder)
orderRouter.get("/:sessionId/verify", isAuthenticated, verifyPaymentStatus)

module.exports = orderRouter