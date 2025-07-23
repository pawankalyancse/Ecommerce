let mongoose = require('mongoose')

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: [100, "Products Below 100 Rupees are not Allowed"]
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Men", "Woman", "Kids"]
    },
    subCategory: {
        type: String,
        required: true,
        enum: ["Topwear", "Bottomwear", "Winterwear"]
    },
    sizes: {
        type: Array,
        validate: {
            validator: function (values) {
                console.log(typeof values, values);
                return Array.isArray(values) &&
                    values.length > 0 &&
                    values.every((value) => ["S", "M", "L", "XL", "XXL", "XXXL"].includes(value))
            },
            message: "At least one size is required and should be S, M, L, XL, XXL or XXXL"
        }
    },
    images: {
        type: [String],
        // required: true
    },
    reviews: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
    collection: "Products"
})

let productModel = mongoose.model("Product", productSchema, "Products")


module.exports = productModel
