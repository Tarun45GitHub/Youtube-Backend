import dotenv  from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path:'./env'
})


connectDB() //for database connect;
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR:while app listening",error);
        throw error;
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`app is listaning on port ${process.env.PORT||8000}`);
        
    })
})
.catch((error)=>{
    console.log("ERROR:while connect DB ",error);
})