if(process.env.NODE_ENV  != "production"){
   require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

//Router
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbURL = process.env.ATLASDB_URL;



main()
.then((res) =>{
    console.log("Connected to db");
}).catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbURL);
}  
app.set("views" , path.join(__dirname ,"views"));
app.set("view engine" ,"ejs");
app.use(express.static(path.join (__dirname ,"public")));
 app.use(express.urlencoded({ extended : true}));//for parsing the data
 app.use(methodOverride("_method"));
 app.engine('ejs' ,ejsMate);

 const store  =  MongoStore.create({
    mongoUrl :dbURL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 3600
});

 store.on("error" , () => {
    console.log("ERROR in MONGO SESSION STORE" ,err)
 });
const sessionOptions = {
    store,
    secret : process.env.SECRET ,
    resave :false  ,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge :7 * 24 * 60 * 60 * 1000,
        httpOnly  : true,
    }
};
 



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req ,res ,next) => {
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser = req.user;
    next();
})



app.use("/listing" ,listingsRouter);
app.use("/listing/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);

  app.get("/" ,(req ,res) =>{
    res.render("/listing");
  })

 //middleware
 app.use( (err , req ,res , next) => {
      const { statusCode =500  , message="Something Went Wrong" } = err;
      //res.status(statusCode).send(message);
      res.status(statusCode).render("./listings/error.ejs" ,{err} );
      
 })


app.listen(3000 ,() =>{
    console.log(" server is Lisenting to the port 3000");
})
