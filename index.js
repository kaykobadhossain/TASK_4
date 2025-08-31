import express from 'express'
import cors from "cors"
import dotenv from "dotenv"
import { db } from './config/db.js';


dotenv.config();

const app = express()

app.use(cors());
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello world")
})

db.then(()=>{
    console.log("DB Connected.")
}).catch((err)=>{
    console.log("DB Error:", err)
})

const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})