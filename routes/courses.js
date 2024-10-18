const {Router}=require("express");
// const {z}=require("zod");
// const jwt=require("jsonwebtoken");
// const {JWT_SECRET_ADMIN,admin_auth}=require("../middleware/admin");
// const { JWT_SECRET_USER,auth } = require("../middleware/user");
const courserouter=Router();
const {purchasesModel,courseModel}=require("../db");
courserouter.get('/courses',async(req,res)=>{
    try{
        const courses=await courseModel.find({});
        if(!courses){
            res.status(400).json({
                message:"no course found"
            });
        }res.status(200).json({
            courses:courses
        });
    }catch(error){
        res.status(500).json({
            message:"internal server error"
        });
    }
});
module.exports={
    courserouter:courserouter
}