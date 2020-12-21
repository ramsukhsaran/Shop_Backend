const router = require('express').Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const User = require('../models/userModel')   // for user model to intract with DB

const auth= require('..//middleware/auth')   // for delete only loged in user (private route)

router.post('/register', async(req, res) => {
    try {
        const { email, password, passwordCheck, name,mobileno,address,role } = req.body
        // validation at server side
        if (!email || !password || !passwordCheck) {
            return res.status(400).json({ msg: "Not All the fields Entered" })
        }
        if (password.length < 8) {
            return res.status(400).json({ msg: "Password min length should be at least 8" })
        }
        if (password !== passwordCheck) {
            return res
                .status(400)
                .json({ msg: "password and confirm password do not match" })
        }

        // for existing user
        const existingUser =await User.findOne({email:email})

        if(existingUser){
            return res.status(400).json({ msg: "This Email is already exists"})
        }

        const hashPassword = await bcrypt.hash(password,10)

        // saving to DB
        const newUser = new User({
            email,
            password:hashPassword,
            name,
            address,
            role,
            mobileno
        })
        const savedUser = await newUser.save()
        if(savedUser){
            res.status(200).json({msg:"SignUp successful"})
        }

    }
    catch(err){
        res.status(500).json(err)
    }
});

router.post('/login',async (req, res)=>{
    try{

        let {email, password} = req.body

        //validate
        if(!email || !password){
            return res.status(400).json({ msg: "not all fields entred"})

        }
        const user= await User.findOne({email:email})
        if(!user){
            return res.status(400).json({ msg: "No account found for this email"})

        }

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({ msg:"Invalid credentials"})
        }

        const payLoad={
            id:user._id,
            name:user.name,
            role:user.role
        }
        const token=jwt.sign(payLoad,process.env.JWT_SECRET)
        res.status(200).json({
            token,
            msg:"Login successful"
        })

    }catch(err){
        res.status(500).json({error:err.message})
    }
})

//creating private routes with only logined users
router.delete("/delete",auth,async(req,res)=>{
    try{

        const deleteUser = await User.findByIdAndDelete(req.user)
        res.status(200).json({msg:"user deleted successfully from database"})
    }
    catch(err){
        res.status(500).json({error:err.message})
    }

})

router.post('/tokenIsValid',async(req,res)=>{
    try{
        const token = req.header('x-auth-token')
        if(!token) return res.json(false)

      const verified=jwt.verify(token,process.env.JWT_SECRET)
      if(!verified) return res.json(false)

      const user= await User.findById(verified.id)
      if(!user) return res.json(false)

      return res.json(true)

    } catch(err){
        res.status(500).json({error:err.message})
    }
})


module.exports = router
