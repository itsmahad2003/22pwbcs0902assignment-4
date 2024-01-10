import mongoose from "mongoose";

const ProductStructure = mongoose.Schema({
    name: String,
    category: String,
    discription: String,
    dialradius: String,
    price: Number,
    image: {
        type: String,
    }
})

const ProductModel = mongoose.model("ProductData", ProductStructure);

export default ProductModel;