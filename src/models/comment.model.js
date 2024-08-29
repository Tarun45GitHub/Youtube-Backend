import mongoose from "mongoose";

const commentSchema= new mongoose.Schema({
    owner:{
        type:Schema.Type.ObjectId,
        ref:"User"
    },
    video:{
        type:Schema.Type>ObjectId,
        ref:"Video"
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true})

export const comment=mongoose.model("Comment",commentSchema);