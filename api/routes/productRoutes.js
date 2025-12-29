let express = require('express')
let upload = require('../config/multer')
let isAuthenticated = require('../middleware/isAuthenticated')
let isAdmin = require('../middleware/isAdmin')
let { addProduct, fetchProducts, updateProduct, deleteProduct, fetchProduct } = require('../controllers/productsControllers')

let productRouter = express.Router()


productRouter.post('/', isAuthenticated, isAdmin, upload.single('image'), addProduct)
productRouter.get('/', isAuthenticated, fetchProducts)
productRouter.get('/:productId', isAuthenticated, fetchProduct)
productRouter.put('/:productId', isAuthenticated, isAdmin, upload.single('image'), updateProduct)
productRouter.delete('/:productId', isAuthenticated, isAdmin, deleteProduct)


module.exports = productRouter
