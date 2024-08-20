import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB=async()=>{
    try {
        const connectionResponse=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB Connected !! DB Host : ${connectionResponse.connection.host}`);
        
    } catch (error) {
       console.log("ERROR:while connect DB ",error);
        process.exit(1)
    }
}

export default connectDB;