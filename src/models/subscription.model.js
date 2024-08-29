import mongoose from "mongoose";

const subscriptionSchema=new mongoose.Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    channle:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})
export const subscription=mongoose.model("Subscription",subscriptionSchema);