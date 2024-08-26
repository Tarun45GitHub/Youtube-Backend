import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import ApiResponse from "../utils/ApiResponse.js"


const registerUser=asyncHandler(async(req,res)=>{
   // 1.get user details from frontend
   const {username,email,password,fullName}=req.body;
   // console.log(username,email,password,fullName);

   //2.Validation -check not empty
   if(
      [fullName,email,username,password].some((field)=>
      field?.trim()==="")
   ){throw new ApiError(400,"All field are required")}

   //3.check if user already exist or not
  const existedUser=await User.findOne({
      $nor:[{username},{email}]
   })
   if (existedUser) {
      throw new ApiError(409, "User with email or username already exists")
  }
   //4.check coaverImage and avatar
   console.log(req.files.avatar);
   const avatarlocalPath=req.files?.avatar[0]?.path;

   // const coverImageLocalPath=req.files?.coverImage?.coverImage[0]?.path
   let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
   if(!avatarlocalPath) throw new ApiError(400,"Avatat image is required")
   
   //5.Uplaod avatar ,coverImges to cloudinary  
    const avatar=await uploadOnCloudinary(avatarlocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar) throw new ApiError(400,"avatar not found")

   //6.create user object-create entry in db
   const user=await User.create({
      fullName,
      username,
      email,
      avatar:avatar.url,
      coverImage:coverImage?.url||"",
      password

   })

   //7.remove password and refresh token field from response
   const createdUser=await User.findById(user._id).select("-password -refreshToken")

   //8.check for user creation 
   if(!createdUser) throw new ApiError(400,"User registering failed,please Try again")

   //9.return response
   return res.status(201).json(
      new ApiResponse(200,createdUser,"user registered successfully")
   )
   
})

export  {registerUser};