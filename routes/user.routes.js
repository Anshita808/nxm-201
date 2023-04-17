const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {UserModel}=require("../models/user.models");
const {BlacklistModel} = require("../models/blacklist.model");
const {PostModel} = require("../models/post.model");


const userRouter = express.Router();

// register
userRouter.post("/register", async(req,res)=>{
    const {name,email,password,role}= req.body
    try {
        const isUserPresent = await UserModel.findOne({email});
        if(isUserPresent){
            return res.status(400).send({msg:"User Already Present"});
        }
        const hashedPass = await bcrypt.hash(password,5);
        const newUser = new UserModel({
            name,email,password:hashedPass,role
        }) 
        await newUser.save()
        res.status(200).send(newUser)
    } catch (error) {
        res.status(400).send({msg:"Something went wrong"});
    }
})

// login
  userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        const isUserPresent = await UserModel.findOne({email});
        if(!isUserPresent){
            return res.status(400).send({msg:"Not a User Please Login"});
        }
        const isPassword = bcrypt.compareSync(password,isUserPresent.password);
        if(!isPassword)
        return res.status(400).send({msg:"Wrong Credentials"});

        const accessToken = jwt.sign({userId:isUserPresent._id}, "accessToken",{
            expiresIn:"1m"
        });
        const refreshToken = jwt.sign({userId:isUserPresent._id},"refreshToken",{
                expiresIn:"3m"
            });
            res.cookie("accessToken",accessToken,{maxAge:1000*60})
            res.cookie("refreshToken",refreshToken,{maxAge:1000*60*3});
        res.status(200).send({msg:"Login Successfull"})
    } catch (error) {
        res.status(400).send({msg:error.message});
    }
  });

//   logout
  userRouter.get("/logout",async(req,res)=>{
    try {
        const {accessToken} = req.cookies;
        const {refreshToken} = req.cookies;
        const blacklistAcc = new BlacklistModel({token:accessToken});
        const blacklistRef = new BlacklistModel({refresh:refreshToken});
        await blacklistAcc.save();
        await blacklistRef.save();
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        res.status(200).send({msg:"Logout Successfull"})
    } catch (error) {
        res.status(500).send({msg:error.message});
    }
  })

//   refresh token
  userRouter.get("/refresh-token",async(req,res)=>{
    try {
        const accessToken = req.cookies.accessToken||req?.headers?.authorization;
        const istokenBlacklisted = await BlacklistModel.find({token:accessToken})
        if(istokenBlacklisted){
            return res.status(400).sendFile({msg:"Login Please"})
        }
        const isTokenValid = jwt.verify(accessToken,"accessToken");
        if(isTokenValid){
            return res.status(400).send({msg:"Login Again Please"})
        }
        const newtoken = jwt.sign({userId: isUserPresent._id},"accessToken",{
           expiresIn:"1m"
        });
        res.cookie("accessToken",newtoken,{maxAge:1000*60});
        res.send({msg:"Token Created Sucessfully"})
        
    } catch (error) {
        res.status(400).send({msg:error.message});
    }
   
  })

module.exports={
    userRouter
}