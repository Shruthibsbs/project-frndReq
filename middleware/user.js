const jwt =require('jsonwebtoken')
const config =require('../db')

const userMiddleware =async(req,res,next)=>{
    try{
        const token =req.header("Authorization"); //ONLY WAY TO SEND TOKEN TO SERVER FROM FRONT-END

        jwt.verify(token,config.accessTokenSecret,(err,user)=>{
            if(err)
            return res.status(400).json({msg:"Invalid Authorization"});

            
            req.user =user;
            next();
        })
    // res.json({token})

    }catch(error){
        return res.status(500).json({msg:error.message})
    }
};

module.exports = userMiddleware;