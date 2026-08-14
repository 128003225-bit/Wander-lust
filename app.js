if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/test";
const wrapAsync = require("./utils/wrapAsync.js");
const path=require("path");
const ejsMate=require("ejs-mate");      //for boilerplate layout
const Review=require("./models/reviews.js");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const { listingSchema } = require("./schema.js");
const reviewsRouter=require("./routes/review.js");
const flash = require("connect-flash");
const session = require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");
const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
};

const listingsRouter=require("./routes/listing.js");
const ExpressError=require("./utils/ExpressError.js");
console.log(ExpressError);
app.engine('ejs',ejsMate);
app.use(express.urlencoded({ extended: true }));    //it allows to get data from form and parse it into req.body
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
   console.log("connected to db"); 
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
    console.log("Hi! i am root");
    res.send("hi");
});



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    console.log("=== Middleware Executed ===");
    console.log("req.user =", req.user);

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
});
//app.get("/demouser",async(req,res)=>{
 //   let fakeUser=new User({
   //     email: "student@gmail.com",
//   username: "delta-student"
//  });
// let registeredUser=await User.register(fakeUser,"hello world");
// res.send(registeredUser);
//});
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
      if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
       next(); 
    }
};



    

   
   
//POST ROUTE

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("error",{message});
   // res.status(statusCode).send(message);
    
});


app.listen(8080,()=>{
    console.log("listening");
});
