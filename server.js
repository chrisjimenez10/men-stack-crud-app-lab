//Import
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const Car = require("./models/car.js");

//Connect to Database
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", ()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

//Middleware
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({extended:false}));

//Start Server
const port = 5000;
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})

//Routes
    //Home Page
app.get("/", (req, res)=>{
    res.render("home.ejs",{})
})
    
app.get("/new", (req, res)=>{
    res.render("new.ejs", {});
})

app.post("/new", async (req, res)=>{
    if(req.body.domestic === "on"){
        req.body.domestic = true;
    }else{
        req.body.domestic = false;
    }
    const newCar = await Car.create(req.body);
    console.log(newCar);
    res.redirect("/index")
})

app.get("/index", async (req, res)=>{
    const carList = await Car.find();
    
    res.render("index.ejs", {
        cars: carList
    });
    
})

// app.get("/index/:id", async (req, res)=>{
//     const 
// })



