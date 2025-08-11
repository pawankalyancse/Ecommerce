const productModel = require('../models/productModel')
const cloudinary = require('../config/cloudinary')

const addProduct = async (req, res, next) => {
    try {
        let item = req.body
        // console.log(item);
        // console.log(req.file);
        let result = await cloudinary.uploader.upload(req.file?.path)
        // console.log(result);
        item.images = [result.secure_url]
        let product = await productModel.create(item)
        return res.status(201).send(product)
    } catch (error) {
        next(error)
        // return res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const fetchProduct = async (req, res, next) => {
    try {
        let { productId } = req.params
        let product = await productModel.findById(productId)
        return res.status(200).send(product)
    } catch (error) {
        next(error)
        // return res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const fetchProducts = async (req, res, next) => {
    try {
        let products = await productModel.find({})
        return res.status(200).send(products)
    } catch (error) {
        next(error)
        // return res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const updateProduct = async (req, res, next) => {
    try {
        let { productId } = req.params
        let item = req.body
        if (req.file?.path) {
            let result = await cloudinary.uploader.upload(req.file?.path)
            item.images = [result.secure_url]
        }
        let product = await productModel.findByIdAndUpdate(productId, { $set: item }, { new: true })
        return res.status(200).send(product)
    } catch (error) {
        next(error)
        // return res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        let { productId } = req.params
        await productModel.findByIdAndDelete(productId)
        return res.status(200).send({ message: "product deleted successfully" })
    } catch (error) {
        next(error)
        // return res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

module.exports = {
    addProduct,
    fetchProducts,
    updateProduct,
    deleteProduct,
    fetchProduct
}