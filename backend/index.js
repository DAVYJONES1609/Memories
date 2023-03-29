import express from "express"
import cors from "cors"//cross origin resource sharing
import mongoose from "mongoose"
// import router from "./routes/media.js"
import router from "./routes/video.js"
import User from "./Models/User.js"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
import config  from "./config/key.js"
import auth from "./middleware/auth.js"
import path from "path"
import commentRouter from "./routes/comment.js"
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const bcrypt = require("bcryptjs");
const __dirname = path.dirname(__filename);
//var ObjectID = require('mongodb').ObjectId;

const app=express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.set("view engine","ejs");
//app.use('/api/v1/media',router);
app.use('/api/comment',commentRouter);
app.use('/api/video',router);//When a client sends an HTTP request to your application 
//with a URL that starts with "/api/video",the router middleware will handle the request 
// app.use('/uploads/thumbnails',express.static(path.join(__dirname,"uploads")))
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({extended:false}))
const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

//connection creation and creating a new db
// mongodb://localhost:27017/gamingrealm
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB connected");
})
.catch((e)=>console.log(e))
//A mongoose schema defines the structure of the document.
// const userSchema=new mongoose.Schema({
//     id:String,
//     name:String,
//     email:String,
//     password:String
// })
//mongoose module is used to create a collection of a particular database of MongoDB.
//const User=new mongoose.model("User",userSchema)
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());
//Routes

// app.get("/auth",auth,(req,res)=>{
//     res.status(200).json({
//         _id:req._id,
//         isAuth:true,
//         email:req.user.email
//     })
// })

app.post("/login",(req,res)=>{
    const{email,password}=req.body
    User.findOne({email:email},(err,user)=>{
        if(user){
            user.comparePassword(password,(err,isMatch)=>{
                if(!isMatch){
                    res.send({message:"Password did'nt match"})
                }
                else{
                    const userData = { 
                        name: user.name, // add the user's name to the response data
                        email: user.email,
                        _id: user._id,
                      };
                    res.send({message:"Login Successfull",user:userData})
                }
            })
            // if(password===user.password){
            //     res.send({message:"Login Successfull",user:user})
            // }
            // else{
            //     res.send({message:"Password did'nt match"})
            // }
            // user.generateToken((err,user)=>{
            //     if(err) return res.status(400).send(err);
            //     res.cookie("x_auth",user.token)
            //     .status(200)
            //     .json({
            //         loginSuccess:true
            //     })
            // })
        }
        else{
            res.send({message:"User not Registered"})
        }
    })
})

app.post("/signup",(req,res)=>{
    const {name,email,password,image}=req.body
    User.findOne({email:email},(err,user)=>{
        if(user){
            res.send({message:"User already Registered"})
        }
        else{
            const user=new User({
                name,
                email,
                password,
                image
            })
            user.save(err=>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send({message:"Successfully Registered!Please Login now."})
                }
            })
        }
    })
    
})

// This code generates a JSON Web Token (JWT) using the jwt.sign() method provided by the jsonwebtoken library. 
// The JWT payload contains two properties: email and id. The values for these properties are obtained 
// from the user object that was retrieved from the database earlier.

// The secret parameter is used as a private key to sign the JWT, and it is constructed by 
// concatenating a constant string with the user's password. The expiresIn option specifies
//  the amount of time for which the JWT should be valid, in this case, it is set to 5 minutes.

app.post("/forgot",(req,res)=>{
    const{email}=req.body
    // res.send({email})
    console.log(email)
    User.findOne({email:email},(err,user)=>{
        if(user){
                res.send({message:"An reset link is sent to your email."})
                const secret = JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:9002/reset-password/${user._id}/${token}`;
    console.log(link);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rsidali9@gmail.com',
          pass: 'tdzufbfybxllqckt'
        }
      });
      
      var mailOptions = {
        from: 'rsidali9@gmail.com',
        to: user.email,
        subject: 'Password Reset',
        text: link
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
        }
        else{
            res.send({message:"User not Registered"})
        }
    })
})

app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    User.findOne({_id:id},(err,user)=>{
        if(user){
            const secret = JWT_SECRET + user.password;
        try {
        const verify = jwt.verify(token, secret);
        res.render("index", { email: verify.email, status: "verified" });
        } catch (error) {
        console.log(error);
        res.send("Not Verified");
        }
        }
        else{
            res.send({message:"User not Registered"})
        }
    })
});

app.post("/reset-password/:id/:token",async (req, res) => {
    const { id, token } = req.params;
    const{password}=req.body;
    console.log(req.params);
    console.log(password);
    User.findOne({_id:id},async (err,user)=>{
         if(user){
            const secret = JWT_SECRET + user.password;
        const verify = jwt.verify(token, secret);
        //const encryptedPassword =await bcrypt.hash(password, 10);
        try{
        await User.updateOne(
          {
            _id:id,
          },
          {
            $set: {
              password: password,
            },
          }
        );
    //    res.json({status:"password updated"})
       res.render("index", { email: verify.email, status: "Verified" });
        } catch (error) {
        console.log(error);
        res.json({status:"Not Verified"});
        }
        }
        else{
            res.send({message:"User not Registered"})
        }
    })
});

app.get("/api/user/logout",auth,(req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},{token:""},(err,doc)=>{
        if(err) return res.json({success:false,err})
        return res.status(200).send({
            success:true
        })
    })
})

app.listen(9002,()=>{
    console.log("BE started at port 9002")
})
