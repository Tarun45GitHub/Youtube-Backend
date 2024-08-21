import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(localfilepath)=>{
    try {
       if(localfilepath){
         const response=await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
         })
         console.log(`file is upload successfully ${response}`);
         return response;
       } 
       else return null; 

    } catch (error) {
       fs.unlinkSync(localfilepath) //remove the locally saved tempurary file as the upload operation got failed
       return null;
    }
}

export {uploadOnCloudinary};