const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../config");
function auth(req,res,next){
    const token=req.headers.authorization;
    if(!token){
        res.status(401).json({
            message:"invalid token"
        });
    }
    try{
        const info=jwt.verify(token,JWT_SECRET);
        req.userId=info;
        next();
    }catch(error){
        res.status(401).json({
            message:"invalid token"
        });
    }
}
module.exports={
    JWT_SECRET,
    auth
};