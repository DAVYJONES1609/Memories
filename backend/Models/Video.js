import { createRequire } from "module";
import User from "./User.js";
const require = createRequire(import.meta.url);
const mongoose= require('mongoose');
const Schema=mongoose.Schema;

const videoSchema=mongoose.Schema({
    writer: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type:String,
        maxlength:50 
    },
    description: {
        type: String
    },
    uploader:{
        type:String
    },
    privacy: {
        type:Number,
    },
    filePath : {
        type:String,
    },
    category: String,
    views : {
        type: Number,
        default:0
    },
    ratings: [{
        user:{
            type:Schema.Types.ObjectId,
            ref: 'User'
        },
        value: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        }
    }],
    duration:{
        type: String
    },
    thumbnail:{
        type:String
    }
},{timestamps:true})

const Video=mongoose.model('Video',videoSchema);

export default Video
