import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mongoose=require('mongoose');

const MediaSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    videos:[{type:String},
    {
        timestamps:true,
    }]
})

const Media=mongoose.model("Media",MediaSchema);
export default Media
