import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mongoose= require('mongoose');
const jwt = require("jsonwebtoken");
const Schema=mongoose.Schema;
const bcrypt=require('bcryptjs');
const saltRounds=10;
const userSchema=new mongoose.Schema({
    id:String,
    name:String,
    email:String,
    password:String,
    image:{
        type:String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
    // token : {
    //     type: String,
    // },
    // tokenExp :{
    //     type: Number
    // }
})
//This is a middleware function for the Mongoose User schema, 
// which is executed before saving a User document to the database.
// The function checks if the User's password has been modified, and if so,
//  generates a salt and hashes the password using the bcrypt library. 
// The saltRounds variable determines the number of rounds to use when generating the salt.
userSchema.pre('save',function(next){
    var user=this;

    if(user.isModified('password')){
    bcrypt.genSalt(saltRounds,function(err,salt){
        if(err) return next(err)

        bcrypt.hash(user.password,salt,function(err,hash){
            if(err)return next(err);
            user.password=hash
            next();
        })
    })}
    else{
        next()
    }
})

userSchema.methods.comparePassword=function(plainPassword,cb){
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken=function(cb){
    var user =this;
    var token=jwt.sign(user._id.toHexString(),'secret')

    user.token=token;
    user.save(function(err,user){
        if(err)return cb(err)
        cb(null,user);
    })
}

userSchema.static.findByToken=function(token,cb){
    var user=this;

    jwt.verify(token,'secret',function(err,decode){
        user.findOne({"_id":decode,"token":token},function(err,user){
            if(err)return cb(err)
            cb(null,user);
        })
    })
}

//mongoose module is used to create a collection of a particular database of MongoDB.
const User=new mongoose.model("User",userSchema)
export default User
