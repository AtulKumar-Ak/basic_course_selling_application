const mongoose=require("mongoose");
const schema=mongoose.Schema;
const ObjectId=mongoose.Types.ObjectId;
const user=new schema({
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    password:{type:String},
});
const admin=new schema({
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    password:{type:String}
});
const courses=new schema({
    creator_id:{type:ObjectId,ref:'admin'},
    course_name:{type:String},
    course_des:{type:String},
    course_price:{type:Number},
    course_imageurl:{type:String}
});
const purchases=new schema({
    userId:{type:ObjectId,ref:'users'},
    courseId:{type:ObjectId,ref:'course'}
});
const userModel=mongoose.model('users',user);
const adminModel=mongoose.model('admins',admin);
const coursesModel=mongoose.model('course',courses);
const purchasesModel=mongoose.model('purchase',purchases);
module.exports={
    userModel,
    adminModel,
    coursesModel,
    purchasesModel
};