const express=require("express");
const app=express();
app.get("/",(req,res)=>{
    res.send("hi,i am root!");
});
//index-users
app.get("/users",(req,res)=>{
    res.send("GET for users");
});
//show-users
app.get("/users",(req,res)=>{
    res.send("GET for show users");
});
//show-users
app.post("/users/:id",(req,res)=>{
    res.send("POST for users");
});
//delete-users
app.delete("/users/:id",(req,res)=>{
    res.send("DELETE for users");
});
app.listen(3000,()=>{
    console.log("server is listening to 3000");
});