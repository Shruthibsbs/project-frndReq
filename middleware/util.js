const jwt =require('jsonwebtoken')
const config=require('../db')

const createAccessToken=(user)=>{
    return jwt.sign(user, config.accessTokenSecret,{expiresIn:'1d'});
};

//to manage the session
const createRefreshToken=(user)=>{
    return jwt.sign(user,config.refreshTokenSecret, {expiresIn:'1d'})
};

module.exports={createAccessToken,createRefreshToken};