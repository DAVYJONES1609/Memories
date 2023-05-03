import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express=require('express');
const router=express.Router();//The express.Router() function creates a new router object,
// which is a middleware function in Express.js.you can then use it to define HTTP routes 
//for your application by chaining various HTTP methods (such as GET, POST, PUT, DELETE, etc.) 
const multer=require('multer');//multer is usedo handle file uploads and store them on a server's file system
import Video from "../Models/Video.js";
var ffmpeg=require('fluent-ffmpeg');
const path=require('path')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/");
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    },
    
})

var upload=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        var ext=path.extname(file.originalname)
        if(ext!=='.mkv'&&ext!=='.mp4'){
            return cb(new Error("Only videos are allowed"));
        }
        cb(null,true);
    }
}).single("file")// The single method indicates that only one file will be uploaded at 
//a time with the name file.

router.post('/uploadfiles',(req,res)=>{
    upload(req,res,err=>{
        if(err){
            return res.json({success:false,err})
        }
        return res.json({success:true,filePath:res.req.file.path,fileName:res.req.file.filename})
    })
})

router.post('/thumbnail',(req,res)=>{
    let thumbsFilePath="";
    let fileDuration="";

    ffmpeg.ffprobe(req.body.filePath,function(err,metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration=metadata.format.duration;
    })


    ffmpeg(req.body.filePath)
  .on('filenames', function(filenames) {
    console.log('Will generate ' + filenames.join(', '))
    thumbsFilePath="uploads/thumbnails/"+filenames[0];
  })
  .on('end', function() {
    console.log('Screenshots taken');
    return res.json({success:true,thumbsFilePath:thumbsFilePath,fileDuration:fileDuration })
  })
  .screenshots({
    // Will take screens at 20%, 40%, 60% and 80% of the video
    count: 3,
    folder: 'uploads/thumbnails',
    size:'320x240',
    filename:'thumbnail-%b.png'
  });

});

router.get('/getVideos',(req,res)=>{
    Video.find()
        .populate('writer')
        .exec((err,videos)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true,videos})
        })
})

router.post('/uploadVideo',(req,res)=>{
    const video=new Video(req.body)

    video.save((err,video)=>{
        if(err) return res.status(400).json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })
})

router.post('/getVideo',(req,res)=>{
    
    Video.findOne({"_id":req.body.videoId})
    .populate('writer')
    .exec((err,videos)=>{
        if(err) return res.status(400).send(err);
        if(videos)return res.status(200).json({success:true,videos})
    })
});

router.post('/rate/:userid/:videoid', async (req, res) => {
    try {
      const video = await Video.findById(req.params.videoid)
  
      // Check if the video exists
      if (!video) {
        return res.status(404).send({ message: 'Video not found' })
      }
  
      // Add the rating to the video
      const existingRatingIndex = video.ratings.findIndex(rating => rating.user.toString() === req.params.userid)
    if (existingRatingIndex !== -1) {
      // Update the existing rating
      video.ratings[existingRatingIndex].value = req.body.rating
    } else {
      // Add the new rating
      video.ratings.push({ user: req.params.userid, value: req.body.rating })
    }
    await video.save();
  
      res.send({ message: 'Rating added successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).send({ message: 'Something went wrong' })
    }
  })

  router.post('/views/:videoId', (req, res) => {
    const id = req.params.videoId;
    Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, (err, video) => {
      if (err) {
        console.error(err);
        res.sendStatus(500).json({ message: 'Something went wrong' });
      } else {
        res.sendStatus(200).json({ message: 'added views' });
      }
    });
  });

  router.get('/ratings/:id',async(req,res)=>{
    try {
        const video = await Video.findById(req.params.id)
        if (!video) {
            return res.status(404).send({ message: 'Video not found' })
          }
          res.send({ ratings: video.ratings });
        }
        catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Something went wrong' })
          }
})

export default router
