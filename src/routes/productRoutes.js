let express = require('express')
let multer = require('multer')
let isAuthenticated = require('../middleware/isAuthenticated')
let isAdmin = require('../middleware/isAdmin')
let { addProduct, fetchProducts } = require('../controllers/productsControllers')

let productRouter = express.Router()
let multerStorage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    },
})
let upload = multer({ storage: multerStorage })


productRouter.post('/', isAuthenticated, isAdmin, upload.single('image'), addProduct)
productRouter.get('/', isAuthenticated, fetchProducts)


module.exports = productRouter

