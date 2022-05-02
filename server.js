const express =require("express");
const mongoose=require("mongoose");
const cors =require('cors')
const cookieParser =require('cookie-parser')
const config =require('./db')
const {createProxyMiddleware} =require ('http-proxy-middleware');
const res = require("express/lib/response");

//reference to express
const app =express();
const PORT=5300;


//configure json and encoding of inputs
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//middleware settings
app.use(cors());
app.use(cookieParser());



//mongodb config using promise
mongoose.Promise=global.Promise;
mongoose.connect(config.dbHost,{ useNewUrlParser: true},(err)=>{
    if(err) throw err;
console.log(`MongoDB connected`)
});

//setting up primary route
app.use(`/auth`,require('./route/userRoute'))
app.use(`/auth`,createProxyMiddleware({target: "http://localhost:5300",changeOrigin:true}))

//server call
app.listen(PORT,()=>{
    console.log(`server is running @http://localhost:${PORT}`)
})