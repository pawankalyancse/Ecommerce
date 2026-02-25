const productModel = require('../../models/productModel')
const { getDataFromRedis, setDataToRedis } = require('../../../redis');
const { PRODUCT_PREFIX_KEY } = require('../../../constants');
const { Query } = require('mongoose');


const fetchProduct = async (_, args) => {
    let { productId } = args

    // check if data exists in redis
    const redisKey = `${PRODUCT_PREFIX_KEY}${productId}`
    const cachedData = await getDataFromRedis(redisKey);
    if (cachedData) return JSON.parse(cachedData);

    // if not exists
    let product = await productModel.findById(productId).lean();

    // add product to redis
    await setDataToRedis(redisKey, JSON.stringify(product))
    return product;
}

const fetchProducts = async () => {
    let products = await productModel.find({})
    return products;
}

module.exports = {
    Query: {
        singleProduct: fetchProduct,
        allProducts: fetchProducts
    }
}

