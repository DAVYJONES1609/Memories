import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express=require('express');
// import mediaController from '../controller/mediaController.js'
import Media from '../Models/Media.js'
// import file from "file-class"
const multer=require('multer')
const fs=require('fs')
const path=require('path')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        if(!fs.existsSync('publics')){
            fs.mkdirSync("publics");
        }
        if(!fs.existsSync("publics/videos")){
            fs.mkdirSync("publics/videos")
        }
        cb(null,"publics/videos");
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    },
})

const upload=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        var ext=path.extname(file.originalname)

        if(ext!=='.mkv'&&ext!=='.mp4'){
            return cb(new Error("Only videos are allowed"));
        }
        cb(null,true);
    }
})

const router=express.Router();

//Get all media
router.get('/all',async(req,res)=>{
    try {
        const media=await Media.find()
        if(media){
        res.json(media)
        }
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
});

//Post create new media
router.post('/create',
upload.fields([
    {
        name:"videos",
        maxCount:5,
    },
])
,async(req,res)=>{
    const {name}=req.body;
    let videosPaths=[];

    if(Array.isArray(req.files.videos)&&req.files.videos.length>0){
        for(let video of req.files.videos){
            videosPaths.push("/"+video.path);
        }
    }

    try {
        const createdMedia=await Media.create({
            name,
            videos:videosPaths
        })

        res.json({message:"Media created successfully",createdMedia})
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
});

export default router
