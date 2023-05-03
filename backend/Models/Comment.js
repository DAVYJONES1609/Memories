import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mongoose= require('mongoose');
const Schema=mongoose.Schema;

const commentSchema=mongoose.Schema({
    writer: {
         type:Schema.Types.ObjectId,
         ref:'User'
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    content:{
        type:String
    }
},{timestamps:true})

const Comment=mongoose.model('Comment',commentSchema);

export default Comment
