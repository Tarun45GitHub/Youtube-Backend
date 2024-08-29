import mongoose from "mongoose";

const tweetSchema=new mongoose.Schema({
    owner:{
        type:Schema.Type.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true})

export const tweet=mongoose.model("Tweet",tweetSchema);