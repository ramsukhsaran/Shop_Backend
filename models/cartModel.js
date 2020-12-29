const mongoose=require('mongoose')

const cartSchema = new mongoose.Schema({
    userId:{type:String},
    items:[{productId:{type:Number},quantity:{type:Number}}]
})

module.exports = Cart = mongoose.model("cart",cartSchema)