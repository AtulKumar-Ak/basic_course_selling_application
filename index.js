const express=require("express");
const mongoose=require("mongoose");
require('dotenv').config();
const app=express();
app.use(express.json());
// const jwt=require("jsonwebtoken");
// const {z}=require("zod");
// const path=require('path');
// const bcrypt=require("bcrypt");
// const {JWT_SECRET,auth}=require("./middleware/user");
// const {JWT_SECRET_ADMIN,admin_auth}=require("./middleware/admin");
const {userrouter}=require("./routes/user");
const {adminrouter}=require("./routes/admin");
const {courserouter}=require("./routes/courses");

app.use("/api/v1/user",userrouter);
app.use("/api/v1/admin",adminrouter);
app.use("/api/v1/courses",courserouter);
app.use("/api/v1",courserouter);

async function main(){
    try{
        const MONGO_URL=process.env.MONGO_URL;
        console.log('MongoDB URI:',MONGO_URL);
        await mongoose.connect(MONGO_URL)
        app.listen(3000,()=>{
            console.log("server is running on port 3000");
        })
    }catch(error){
        console.log("failed to connect to the database"+error);
    }
}
main();