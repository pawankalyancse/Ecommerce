let express = require('express')
let cartRouter = express.Router()
let isAuthenticated = require('../middleware/isAuthenticated')
let { updateCartItems } = require('../controllers/cartControllers')


cartRouter.post('/', isAuthenticated, updateCartItems)

module.exports = cartRouter
