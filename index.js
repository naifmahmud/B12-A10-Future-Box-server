require("dotenv").config();
const express= require("express");
const cors= require("cors");
const port= process.env.PORT || 3000;


const app=express();


app.get('/',(req,res)=>{
    res.send("My server is running")
})

app.listen(port,()=>{
    console.log(`my server is running on PORT: ${port}`);
    
})