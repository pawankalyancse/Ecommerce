const productModel = require('../models/productModel')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})


const addProduct = async (req, res) => {
    try {
        let item = req.body
        console.log(item);
        console.log(req.file);
        let result = await cloudinary.uploader.upload(req.file?.path)
        console.log(result);
        item = {...item, images : [result.secure_url]}
        let product = await productModel.create(item)
        return res.status(201).send(product)
    } catch (error) {
        return res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const fetchProducts = async (req, res) => {
    try {
        let products = await productModel.find({})
        return res.status(200).send(products)
    } catch (error) {
        return res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}


module.exports = {
    addProduct,
    fetchProducts
}