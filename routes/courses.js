const {Router}=require("express");
// const {z}=require("zod");
// const jwt=require("jsonwebtoken");
// const {JWT_SECRET_ADMIN,admin_auth}=require("../middleware/admin");
// const { JWT_SECRET_USER,auth } = require("../middleware/user");
const courserouter=Router();
const {purchasesModel,coursesModel}=require("../db");
courserouter.get('/',async(req,res)=>{
    try{
        const courses=await coursesModel.find({});
        if(!courses){
            return res.status(400).json({
                message:"no course found"
            });
        }return res.status(200).json({
            courses:courses
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"internal server error"
        });
    }
});
module.exports={
    courserouter:courserouter
}