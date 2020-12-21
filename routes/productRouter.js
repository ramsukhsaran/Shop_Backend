const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

const Product = require('../models/productModel')


const auth = require('../middleware/auth');

// get all products.
router.get('/',async (req, res)=>{

    try{
        
        const products = await  Product.find()
         res.json(products);


    }catch(err){
        res.status(500).json(err)
    }

})

// adding products 
router.post('/add',async (req, res)=>{
    const {ProductId,ProductTitle,ProductImgUrl,ProductDes,Price} = req.body
    const newProduct = new Product({
        ProductId,
        ProductTitle,
        ProductImgUrl,
        ProductDes,
        Price

    })

    const savedProduct = await newProduct.save()
    if(savedProduct){
        res.status(200).json(savedProduct)
    }

})

//delete product

router.delete('/delete', async (req, res)=>{
    const productId = req.body.ProductId
    console.log(productId)
    const productDelete = await Product.deleteOne({ProductId:productId})
    
     
    if(productDelete){
        res.status(204).json({msg:"Product deleted successfully"})
    }
    else{
        res.status(404).json({msg:"Can Not Process This request Error !"})
    }

})

module.exports = router