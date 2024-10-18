require('dotenv').config()
const JWT_SECRET=process.env.JWT_SECRET;
const JWT_SECRET_ADMIN=process.env.JWT_SECRET_ADMIN
 
module.exports=({
    JWT_SECRET,
    JWT_SECRET_ADMIN
});