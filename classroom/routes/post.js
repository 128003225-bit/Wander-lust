const express=require("express");
const router=express.Router();
app.get("/posts",(req,res)=>{
    res.send("GET for users");
});
//show
app.get("/posts",(req,res)=>{
    res.send("GET for show users");
});
//show
app.post("/posts/:id",(req,res)=>{
    res.send("POST for users");
});
//delete
app.delete("/posts/:id",(req,res)=>{
    res.send("DELETE for users");
});