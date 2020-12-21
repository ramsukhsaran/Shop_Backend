const mongoose= require('mongoose')

//creating schema
const productSchema = new mongoose.Schema({ 
    ProductDes:{type:String},
    ProductImgUrl:{type:String},
    ProductId:{type:Number},
    ProductTitle:{type:String},
    Price:{type:Number}

})
module.exports = Product = mongoose.model("products",productSchema)