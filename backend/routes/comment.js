import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express=require('express');
const router=express.Router();//The express.Router() function creates a new router object,
// which is a middleware function in Express.js.you can then use it to define HTTP routes 
//for your application by chaining various HTTP methods (such as GET, POST, PUT, DELETE, etc.) 
const multer=require('multer');//multer is usedo handle file uploads and store them on a server's file system
import Comment from "../Models/Comment.js";

router.post("/saveComment", (req, res) => {
    console.log(req.body)
    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if (err) return res.json({ success: false, err })

        Comment.find({ '_id': comment._id })
            .populate('writer')
            .exec((err, result) => {
                if (err) return res.json({ success: false, err })
                return res.status(200).json({ success: true, result })
            })
    })

})

router.post("/getComments", (req, res) => {
    Comment.find({'postId':req.body.videoId})
        .populate('writer')
        .exec((err,comments)=>{
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true,comments})
        })
})

export default router
