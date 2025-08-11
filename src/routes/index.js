let router = require('express').Router()
let isAuthenticated = require('../middleware/isAuthenticated')
let { getCurrentUser } = require('../controllers/usersControllers')

let userRouter = require('./userRoutes')
let productRouter = require('./productRoutes')
let cartRouter = require('./cartRoutes')

router.get('/', isAuthenticated, getCurrentUser)
router.use('/users', userRouter)
router.use('/products', productRouter)
router.use('/cart', cartRouter)


module.exports = router