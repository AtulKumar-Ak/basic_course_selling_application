const {Router}=require("express");
const {z}=require("zod");
const jwt=require("jsonwebtoken");
const {admin_auth}=require("../middleware/admin");
const {JWT_SECRET_ADMIN}=require("../config");
const adminrouter=Router();
const {adminModel,courseModel}=require("../db");
adminrouter.post('/signup',async(req,res)=>{
    const {email,adminname,password}=req.body;
    if(!email || !adminname || !password){
        res.status(400).json({
            message:"incomplete credentials"
        });
    }
    const requireBody=z.object({
        email:z.string().email().max(100).min(5),
        adminname:z.string().min(5).max(15),
        password:z.string().min(5).max(15)
    });
    const pasrseddata=requireBody.safeParse(req.body);
    if(!pasrseddata.success){
        res.status(400).json({
            message:"incorrect format",
            error:pasrseddata.error
        });
    }
    try{
        const user=await adminModel.findOne({adminname,email});
        if(user){
            res.status(400).json({
                message:"adminname or email already in use"
            });
        }
        const hashedpassword=await bcrypt.hash(password,10);
        await adminModel.create({
            adminname:adminname,
            email:email,
            password:hashedpassword
        })
        res.status(200).json({
            message:"admin added successfully"
        });
    }catch(error){
        res.status(500).json({
            message:"internal server error"
        });
    }
});
adminrouter.post('/signin',admin_auth,async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        res.status(400).json({
            message:"incomplete credentials"
        });
    }
    const requireBody=z.object({
        email:z.string().email().max(100).min(5),
        password:z.string().min(5).max(15)
    });
    const pasrseddata=requireBody.safeParse(req.body);
    if(!pasrseddata.success){
        res.status(400).json({
            message:"incorrect format",
            error:pasrseddata.error
        });
    }
    try{
        const user=await adminModel.findOne({email});
        if(!user){
            res.status(400).json({
                message:"invalid credentials"
            })
        }
        const compare=await bcrypt.compare(password,user.password);
        if(!compare){
            res.status(400).json({
                message:"invalid credentials"
            })
        }const token=jwt.sign({
            id:user._id.toString()
        },JWT_SECRET_ADMIN);
        res.status(200).json({
            message:"login successfull",
            authorization:token
        });
    }catch(error){
        res.status(500).json({
            message:"internal server error"
        })
    }
});
// adminrouter.get(/admin-me',admin_auth,(req,res)=>{

// });
adminrouter.post('/create/course',admin_auth,async(req,res)=>{
    const {course_name,course_des,course_price,course_imageurl}=req.body;
    if(!course_name||!course_des||!course_price||!course_imageurl){
        res.status(400).json({
            message:"incomplete credentials"
        });
    }requireBody=z.object({
        course_name:z.string().min(5).max(30),
        course_des:z.string().min(10).max(100),
        course_price:z.string().max(10),
        course_imageurl:z.string().min(5).max(100)
    });
    const pasrseddata=requireBody.safeParse(req.body);
    if(!pasrseddata.success){
        res.status(400).json({
            message:"incorrect format",
            error:pasrseddata.error
        });
    }try{
        await courseModel.create({
            creator_id:req.userId,
            course_name:course_name,
            course_des:course_des,
            course_price:course_price,
            course_imageurl:course_imageurl
        })
    }catch(error){
        res.status(500).json({
            message:"internal server error"
        });
    }
});
adminrouter.get('/my/courses',admin_auth,async(req,res)=>{
    try{
        const courses=await courseModel.find({userId:req.userId});
        if(!courses){
            res.status(400).json({
                message:"No courses"
            })
        }res.status(200).json({
            courses:courses
        });
    }catch(error){
        res.status(500).json({
            message:"internal server error"
        });
    }
});
adminrouter.put('/update/courses',admin_auth,async(req,res)=>{
    try{
        const {courseid,course_name,course_des,course_price,course_imageurl}=req.body;
        requireBody=z.object({
            courseid:z.string().min(5),
            course_name:z.string().min(5).max(30).optional(),
            course_des:z.string().min(10).max(100).optional(),
            course_price:z.string().max(10).optional(),
            course_imageurl:z.string().min(5).max(100).optional()
        });
        const pasrseddata=requireBody.safeParse(req.body);
        if(!pasrseddata.success){
            res.status(400).json({
                message:"incorrect format",
                error:pasrseddata.error
            });
        }
        const course=await courseModel.findOne({
            _id:courseid,
            creator_id:req.userId
        });
        if(!course){
            res.status(400).json({
                message:"course not found"
            });
        }await course.updateOne({
            _id:courseid,
            creator_id:req.userId
        },{
            course_name:course_name||course.course_name,
            course_des:course_des||course.course.course_des,
            course_price:course_price||course.course_price,
            course_imageurl:course_imageurl||course.course_imageurl
        });
        res.status(200).json({
            message:"course details updated successfully"
        });

    }catch(error){
        res.status(500).json({
            message:"internal server error"
        });
    }
        
});
adminrouter.post('/delete/course',admin_auth,async(req,res)=>{
    try{

        const {courseid}=req.body;
        const course=await courseModel.findOne({
            _id:courseid,
            creator_id:req.userId
        });
        if(!course){
            res.status(400).json({
                message:"course not found"
            });
        }await courseModel.deleteOne({
            _id:courseid,
            creator_id:req,userId
        });
    }catch(error){
        res.status(500).json({
            message:"internal server error"
        });
    }
});
module.exports={
    adminrouter:adminrouter
}