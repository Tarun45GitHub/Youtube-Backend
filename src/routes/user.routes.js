import { Router } from "express";
import{ changeUsersPassword, loginUser, logoutUser, RefreshAccessToken, registerUser }from "../controllers/user.controller.js";
import {upload }from '../middlewares/multer.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter=Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ])
   , registerUser)

userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/refreshtoken").post(RefreshAccessToken)
userRouter.route("/change-password").post(verifyJWT,changeUsersPassword)


export default userRouter;