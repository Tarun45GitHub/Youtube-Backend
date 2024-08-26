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
    return (req,res,nex)=>{
        Promise.resolve(reqFun(req,res,nex))
        .catch((error)=>nex(error))
    }
}

export default asyncHandler;