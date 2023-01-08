const Product = require("../models/Product");
const StatusCodes = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    
    res.status(StatusCodes.CREATED).json({product});
}
const getAllProducts = async (req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ products, count: products.length })
}
const getSingleProduct = async (req, res) => {
    const {params: {id: productId}} = req;
    const product = await Product.findOne({_id: productId}).populate("reviews");
    if(!product) {
        throw new CustomError.NotFoundError(`No product found with id: ${productId}.`);
    }    
    res.status(StatusCodes.OK).json({product});
}
const updateProduct = async (req, res) => {
    const {params: {id: productId}} = req;
    const product = await Product.findOneAndUpdate({_id: productId}, req.body, {new: true, runValidators: true});
    if(!product) {
        throw new CustomError.NotFoundError(`No product found with id: ${productId}.`);
    }    
    res.status(StatusCodes.OK).json({product});
}
const deleteProduct = async (req, res) => {
    const {params: {id: productId}} = req;
    const product = await Product.findOne({_id: productId});
    if(!product) {
        throw new CustomError.NotFoundError(`No product found with id: ${productId}.`);
    } 
    await product.remove();
    res.status(StatusCodes.OK).json({ msg: "Product removed successfully..." });
}
const uploadImage = async (req, res) => {
    if(!req.files) {
        throw new CustomError.BadRequestError("No file provided...")
    }
    const productImage = req.files.image;
    const maxSize = 1024 * 1024;
    if(!productImage.mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please upload an image...")
    }
    if(productImage.size > maxSize) {
        throw new CustomError.BadRequestError("Image must be under 1MB...")
    };
    console.log(__dirname);
    const imagePath = path.join(__dirname, "../public/uploads/" + `${productImage.name}`)
    await productImage.mv(imagePath);
    res.send("Upload image...");
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
}