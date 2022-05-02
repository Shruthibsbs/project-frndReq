const jwt=require('jsonwebtoken')
const {createAccessToken,createRefreshToken}= require('../middleware/util');
const config =require('../db')
const User =require ("../model/User")
const  bcrypt = require("bcrypt") 
const fs =require ("fs");
const { response } = require('express');
const { JSONCookie } = require('cookie-parser');


const UserCtrl={
      
    register:async(req,res)=>{
        try{
            // res.json("register works")
            const{username ,email,password}=req.body;
 
             const passHash =await bcrypt.hash(password,10);
 
          const newUser= await User({
              username,
              email,
              password:passHash
          });  
            const user= await newUser.save();
 
            res.status(200).json({msg:"user registered Successfully"});
         }catch(err){
             return res.status(500).json({msg:err.message})
         }
        },
    login:async(req,res)=>{
        try{
            // res.json("login works")
            const {email,password}=req.body;

            const extUser =await User.findOne({email});
            if(!extUser)
            return res.status(400).json({msg:"user doesn't exists"});
 
            const isMatch =await bcrypt.compare(password,extUser.password);
            if(!isMatch)
                  return res.status(400).json({msg:"password doesn't match"});
 
           const accessToken =createAccessToken({id:extUser._id});
           const refreshToken=createRefreshToken({id:extUser._id});
 
            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                path:'/auth/refreshToken',
                maxAge:1*24*60*60*1000
            })
 
            res.json({accessToken})
          //  res.json("login successfull")
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
        },
    refreshToken:async(req,res)=>{
            try{
                //res.json("refresh token works")
                const rToken =req.cookies.refreshToken;
                if(!rToken)
                return res.status(400).json({msg:"Session Expired, Login again.."});
    
                  jwt.verify(rToken,config.refreshTokenSecret,(err,user)=>{
                    if(err)
                    return res.status(400).json({msg:"session Expired,login again"});
    
                    const accessToken=  createAccessToken({id:user.id})
                    res.json({accessToken})
                })
               // res.json({rToken})
    
                }catch(err){
                return res.status(500).json({msg:err.message})
            }
        },
    getUser:async(req,res)=>{
            try{
               // res.json({id:req.user})
    
                const user =await User.findById(req.user.id).select('-password')    
                    if(!user)
                    return res.status(400).json({msg:"User doesn't exists"})
    
                    res.json({"userInfo":user})
            }catch(err){
                return res.status(500).json({msg:err.message})
            }
        },
    updateProfile: async (req,res)=>{
        if(req.body.id===req.params._id){
            if(req.body.password){
                try {
                    const salt =await bcrypt.genSalt(10);
                    req.body.password=await bcrypt.hash(req.body.password,salt)
                } catch (err) {
                   return res.status(500).json(err); 
                }
                }
                try {
                    const user =await User.findByIdAndUpdate(req.params.id,{
                        $set:req.body,      //to update all the fields 
                    });
                    res.status(200).json({msg:"account updated successfully"})
                } catch (err) {
                     return res.status(200).json({msg:"account could not be updated "})
                }
        }else{
            return res.json({msg:"You can update only your account"})
        }
    },
    searchFriend: async(req,res)=>{
          // res.json("searching")
          if(req.body.id !== req.params._id) {
            try {
                const user =await User.findById(req.params.id);  //user -having the "/:id" -one recieving request
                const currentuser =await User.findById(req.body.id); //currentuser-one making request

                    if(!user.friendRequestRecieved.includes(req.body.id)){
                        await user.updateOne({$push:{friendRequestRecieved:req.body.id}})
                        await currentuser.updateOne({$push:{friendRequestSent:req.params.id}})

                        res.status(200).json({msg:`you have sent a friend request`})
                    }else{
                        res.status(400).json({msg:"you have already sent a friend request"})
                    }
                } catch (err) {
                    return res.status(400).json(err)
                }
       }else{
           res.status(400).json({msg:"You cannot send friend request to yourself"});
        }
    },  
    acceptRequest: async(req,res)=>{
        if(req.body.id !== req.params._id) {
            try {
                const user =await User.findById(req.params.id);  //user -having the "/:id" -one recieving request
                const currentuser =await User.findById(req.body.id); //currentuser-one making request

                    if(!user.friendRequestRecieved.includes(req.body.id)){
                        await user.updateOne({$push:{friends:req.body.id}})
                        //user.updateOne({$pull:{friendRequestRecieved:req.body.id}})
                        await currentuser.updateOne({$push:{friends:req.params.id}})
                        //currentuser.updateOne({$pull:{friendRequestSent:req.params.id}})
                         
        
                        res.status(200).json({msg:`you have accepted friend request`})
                    }else{
                        res.status(400).json({msg:"not recieved any request"})
                    }
                } catch (err) {
                    return res.status(400).json(err)
                }
       }else{
           res.status(400).json({msg:"You cannot accept friend request of yourself"});
        }
    },  
    declineRequest :async(req,res)=>{
        if(req.body.id !== req.params._id) {
            try {
                const user =await User.findById(req.params.id);  //user -having the "/:id" -one recieving request
                const currentuser =await User.findById(req.body.id); //currentuser-one making request

                    if(!user.friendRequestRecieved.includes(req.body.id)){
                       // await user.updateOne({$push:{friends:req.body.id}})
                        user.updateOne({$pull:{friendRequestRecieved:req.body.id}})
                      //  await currentuser.updateOne({$push:{friends:req.params.id}})
                       // currentuser.updateOne({$pull:{friendRequestSent:req.params.id}})
                         
        
                        res.status(200).json({msg:`you have declined friend request`})
                    }else{
                        res.status(400).json({msg:"not recieved any request"})
                    }
                } catch (err) {
                    return res.status(400).json(err)
                }
       }else{
           res.status(400).json({msg:"You cannot decline friend request of yourself"});
        }
    }, 
    
    logout: async (req,res)=>{
        try{
           // res.json("logout works")
           res.clearCookie('refreshToken',{path:'/auth/refreshToken'});
            res.status(200).json({msg:"successfully logout.."})
           
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
};

module.exports=UserCtrl;