import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'


const app=express();

app.use(cookieParser())

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})) //for jason data

app.use(express.urlencoded({extended:true,limit:"16kb"})) //for url data

app.use(express.static("public")) //for public data like notice pdf ,fabicon


export default app;


