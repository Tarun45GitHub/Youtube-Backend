import mongoose from "mongoose";

const likeSchema=new mongoose.Schema({
    comment:{
        type:Schema.Type.ObjectId,
        ref:"Comment"
    },
    video:{
        type:Schema.Type.ObjectId,
        ref:"Video"
    },
    likedBy:{
        type:Schema.Type.ObjectId,
        ref:"Like"
    },
    tweet:{
        type:Schema.Type.ObjectId,
        ref:"Tweet"
    }
})

export const like=mongoose.model("Like",likeSchema)