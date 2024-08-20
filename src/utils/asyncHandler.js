// const asyncHandler=(reqFun)=>async(err,req,res,nex)=>{
//     try {
//         await reqFun(err,req,res,nex);
        
//     } catch (error) {
//         res.status(error.code||500).json({
//             success:false,
//             massage:error.massage
//         })
//     }
// }

const asyncHandler=(reqFun)=>{
    (err,req,res,nex)=>{
        Promise.resolve(reqFun(err,req,res,nex))
        .reject((error)=>nex(error))
    }
}

export default asyncHandler;