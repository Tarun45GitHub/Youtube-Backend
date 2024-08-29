import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens=async(userid)=>{
   try {
      const user= await User.findById(userid)
      // console.log(user);
      const refreshToken=await user.generateRefreshToken();
      const accessToken=await  user.generateAccessToken();
      user.refreshToken=refreshToken;
      await user.save({validateBeforeSave:false})
      // console.log(accessToken);
      
      return {accessToken,refreshToken};
   } catch (error) {
      throw new ApiError(500,"something went wrong while generating refresh and access token")
   }
}

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
      $or:[{username},{email}]
   })
   if (existedUser) {
      throw new ApiError(409, "User with email or username already exists")
  }
   //4.check coaverImage and avatar
   // console.log(req.files);
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

const loginUser=asyncHandler(async(req,res)=>{
   //1.Take email,password
   // const {username,email,password}=req.body;
   const {username,email,password}=req.body;
   // console.log(email);
   // console.log(password);
   
   
   if(!(username || email)){
      throw new ApiError(404,"email or username is required")
   }
   if(!password) throw new ApiError(404,"password is required")
   //2.check user exist or not
   const user=await User.findOne({
      $or:[{username},{email}]
   })
   if (!user) {
      throw new ApiError(409, "User not exist Please Register")
  }
   //3.password check
   const isPasswordValid=await user.isPasswordCorrect(password)
   if(!isPasswordValid) {throw new ApiError(404,"Invalid Password")}
   //4.Generate Toke 
   // console.log(user._id);
   
   const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);
   //5.send cookise
   // console.log(accessToken);
   const loggedUser=await User.findById(user._id).select("-password -refreshToken");

   const options={
      httpOnly:true,
      secure:true
   }

   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
      new ApiResponse(200,loggedUser,"user Logged in Succfully")
   )
})

const logoutUser=asyncHandler(async(req,res)=>{
   //find user id
   const id= req.user?._id;

   await User.findByIdAndUpdate(id,
      {
      $set:{
         refreshToken:undefined
      }
   },{
      new:true
   })

   const options={
      httpOnly:true,
      secure:true
   }
   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged out"))
})

const RefreshAccessToken=asyncHandler(async(req,res)=>{
   try {
      const token=req.cookies?.refreshToken;
      if(!token) {
         throw new ApiError("Unauthorised request")
      }
      const decodedToken=jwt.verify(token,process.env.REFREASH_TOKEN_SECRET)
      const user= await User.findById(decodedToken?._id);
      if(!user) {
         throw new ApiError("Invalid rfresh token");
      }
      if(token!==user.refreshToken) {
         throw new ApiError("Invalid rfresh token");
      }

      const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);

      console.log(accessToken,refreshToken);
      

      const options={
         httpOnly:true,
         secure:true
      }
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(new ApiResponse(200,{
         accessToken:accessToken,
         refreshToken:refreshToken
      },"Access token refreshed Succfully"))

   } catch (error) {
      throw new ApiError(404,"error while refresh access token",error)
   }
})

const changeUsersPassword=asyncHandler(async(req,res)=>{
   const {oldPassword,newPassword,confirmPassword}=req.body;
   // console.log(oldPassword,newPassword);

   if([oldPassword,newPassword,confirmPassword].some((field)=>field?.trim==="")){
      throw new ApiError("all field are required")
   }
   if(!(newPassword===confirmPassword)) throw new ApiError("new pasword and confirm is not matched");
   const user=await User.findById(req.user?._id);
   // console.log(user);
   if(!user) throw new ApiError("user not found");

   const passwordChecked= await user.isPasswordCorrect(oldPassword);
   if(!passwordChecked) {throw new ApiError("Invalid pasword")}
   user.password=newPassword;
   await user.save({validateBeforeSave:false})

   return res.status(200).json(
      new ApiResponse(200,{},"password update successfully")
   )
})

export  {registerUser,
         loginUser,
         logoutUser,
         RefreshAccessToken,
         changeUsersPassword
};