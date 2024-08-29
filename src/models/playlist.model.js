import mongoose, { Schema } from "mongoose";

const playlistSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Type.ObjectId,
        ref:"User"
    },
    videos:[
        {
            type:Schema.Type.ObjectId,
            ref:"Video"
        }
    ]
},{timestamps:true})

export const playlist=new mongoose.model("Playlist",playlistSchema)