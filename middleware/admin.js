const jwt=require("jsonwebtoken");
const {JWT_SECRET_ADMIN}=require("../config");
function admin_auth(req,res,next){
    const token=req.headers.authorization;
    if(!token){
        res.status(401).json({
            message:"invalid token"
        });
    }
    try{
        const info=jwt.verify(token,JWT_SECRET_ADMIN);
        req.userId=info;
        next();
    }catch(error){
        res.status(401).json({
            message:"invalid token"
        });
    }
}
module.exports={
    admin_auth,
    JWT_SECRET_ADMIN
}