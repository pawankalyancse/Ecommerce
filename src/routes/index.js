let router = require('express').Router()
let isAuthenticated = require('../middleware/isAuthenticated')
let { getCurrentUser } = require('../controllers/usersControllers')

let userRouter = require('./userRoutes')
let productRouter = require('./productRoutes')
let cartRouter = require('./cartRoutes')
let orderRouter = require('./orderRoutes')

router.get('/', isAuthenticated, getCurrentUser)
router.use('/users', userRouter)
router.use('/products', productRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)
router.get('/payment', (req, res) => {
    let { success } = req.query
    return res.status(200).send(`Payment ${success === "true" ? "Successful ✅" : " Failed ⛔"}`)
})


module.exports = router