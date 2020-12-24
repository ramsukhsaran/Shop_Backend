const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

const Product = require('../models/productModel')   // product model DB


const auth = require('../middleware/auth');

// get all products.
router.get('/',async (req, res)=>{
 
        const products = await  Product.find((err,products)=>{
            if(!err){
                return res.send(products);

            }
            else{
                return res.send(err);
            }
        })


})
// get product by Id
router.get('/productId/:id', async (req, res)=>{
    
   
        const product = await Product.findOne({ProductId:req.params.id}) 
        if(product){
            res.json(product)
        }
        else{
            res.status(500).json({msg:"product not found"})
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
        res.status(200).json({msg:"Product is Added Successfully"})
    }

})

//update product 
// http://localhost:5000/products/update/
router.put('/update/:id',async (req, res)=>{
    const product = await Product.findOne({ProductId: req.params.id})
    product.ProductTitle=req.body.ProductTitle;
    product.ProductDes=req.body.ProductDes;
    product.ProductImgUrl=req.body.ProductImgUrl;
    product.Price=req.body.Price;

    //save product db
    await product.save((err)=>{
        if(!err){
            res.status(200).json({msg:"Updated Successfully"})
        } else{
            res.send(err)
        }
    })

})

//delete product
// http:localhost/products/delete/
router.delete('/delete/:id', async (req, res)=>{
    
    const product = await Product.findOne({ProductId: req.params.id})
    product.remove((err)=>{
        if(!err){
            return res.json({msg:"Deleted Successfully"})
        } else{
            return res.json(err)
        }
    })
  

})

module.exports = router