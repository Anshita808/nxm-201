const checkRole = (permitRole)=>{
    return function (req,res,next){
        const user_role = req.role
        if(permitRole.includes(user_role)){
            return next()
        }else{
            return res.status(403).send({msg:"you are not authorise"})
        }
    }
}

module.exports = {
    checkRole
}