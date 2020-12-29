const router = require('express').Router()
const Cart = require('../models/cartModel')





// get cart items
router.get('/:id', async (req, res) => {

    const cartItem = await Cart.findOne({userId: req.params.id})
    if(cartItem){
        res.json(cartItem)
    }else{
        res.status(500).json({msg:'cart item not found'})
    }

    
})

// post cart item
router.post('/add', async (req, res) => {
    const { userId, items } = req.body
    try{
        let cart = await Cart.findOne({userId})
        if(cart){   
            let itemIndex = cart.items.findIndex(I=>I.productId === items.productId)
            
            if(itemIndex > -1){
                let productItem= cart.items[itemIndex];
                productItem.quantity=items.quantity
                cart.items[itemIndex]=productItem

            }else{
                //item does not exist in cart so push new item
                cart.items.push({productId: items.productId, quantity: items.quantity})
            }
            cart = await cart.save()
            return res.status(201).send(cart)

        }else{
            const cartItem = new Cart({
                        userId,
                        items
                    })
            const saveCartItem = await cartItem.save()
            if (saveCartItem) {
                        res.status(200).json({ msg: 'cart item saved' })
            }
    }

    }catch(err){
        res.status(500).json({error:"Error Occured"})
    }

})

// update cart  item quantity
router.put('/update/:id',async (req,res)=>{
    const {items}=req.body
    let cart = await Cart.findOne({userId:req.params.id})
    if(cart){
        let itemIndex = cart.items.findIndex(I=>I.productId === items.productId)
        
        if(itemIndex > -1){
            let productItem= cart.items[itemIndex];
            productItem.quantity=items.quantity
            cart.items[itemIndex]=productItem

        }
        cart = await cart.save()
        return res.status(201).json({ msg:'cart successfully updated'})   
    }  
})

router.delete('/delete/:id', async (req, res)=>{
    const cart  = await Cart.findOne({ userId: req.params.id})
    if(cart){
        cart.remove((err)=>{
            if(!err){
                return res.json({ msg:'cart successfully removed'})

            }else{
                return res.json('item not found')
            }
        })
    }

})

module.exports = router