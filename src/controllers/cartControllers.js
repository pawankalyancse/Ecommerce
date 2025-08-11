let userModel = require('../models/userModel')
let { sendResponse } = require('../utils/apiUtil')

const updateCartItems = async (req, res, next) => {
    try {
        let { productId, quantity } = req.body
        let { id } = req.user
        let user = await userModel.findById(id)
        let existingItem = user.cart.find(item => item.product == productId)
        if (!existingItem) {
            if (quantity > 0) {
                user.cart.push({ product: productId, quantity })
            }
        }
        else {
            if (quantity > 0) {
                existingItem.quantity = quantity
            }
            else {
                user.cart = user.cart.filter(item => item.product !== existingItem.product)
            }
        }
        await user.save()
        return sendResponse(res, 200, user.cart)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    updateCartItems,
}