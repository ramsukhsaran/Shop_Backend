const express = require('express')
const mongoose= require('mongoose')
const cors=require('cors')
const bodyParser=require('body-parser')
require('dotenv').config()


// set up mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{ useUnifiedTopology: true })
        .then(()=>console.log('connected with mongodb'))
        .catch(err => console.log(err))


//set up express app

const app = express()

//middleware
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false})) 
app.use(cors())


// set up for routes

app.use("/users",require("./routes/userRouter"))
app.use("/products",require('./routes/productRouter'))
app.use("/cart",require('./routes/cartRouter'))



//server config
const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log('app is running at post 5000')
})

