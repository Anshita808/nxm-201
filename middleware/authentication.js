const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.models");
const { BlacklistModel } = require("../models/blacklist.model");



const auth = async(req,res,next)=>{
    const { accessToken } = req.cookies;

    try {
         const isTokenblack = await BlacklistModel.findOne({
           token: accessToken,
         });
         if(isTokenblack){
            return res.status(400).send({msg:"please login again........"})
         }
        if(accessToken){
            let verify = jwt.verify(accessToken,"accessToken");
            const {userId} = verify;
            const user =  await UserModel.findOne({_id:userId})
            const role = user?.role
            req.role = role
            if(verify){
                req.body.userId = verify.userId
                next()
            }else{
              res.status(400).send({msg:"login first"})
            }
            jwt.verify(accessToken, "accessToken",async(err,decoded)=>{
                if(err){
                    if(err.message=="jwt expired"){
                        const newToken = await fetch(
                            "http://localhost:8080/user/refresh-token",{
                                headers:{
                                    "Content-type":"application/json",
                                    "Authorization":"req.cookies.refresh-token"
                                }
                            }
                        ).then((res)=>res.json());
                        res.cookies("accessToken",newToken,{maxAge:1000*60})
                        next()
                    }
                }else{
                    next()
                }
            });
        }
    } catch (error) {
        res.send(error)
    }
}


module.exports = {
    auth
}