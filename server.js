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
    //Index Page
app.get("/index", async (req, res)=>{
    const carList = await Car.find();
    res.render("index.ejs", {
        cars: carList
    });
    
})
    //Create Car Show Form Page
app.get("/index/new", (req, res)=>{
    res.render("new.ejs", {});
})
    //Create Car Submission Request
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

    //Display Car Details
app.get("/index/:id", async (req, res)=>{
    const id = req.params.id;
    const carSingle = await Car.findById(id)
    // console.log(typeof carSingle._id);
    res.render("car-details.ejs",{
        car: carSingle
    });
})

app.get("/index/:id/edit", (req, res)=>{
    res.render("edit-car.ejs", {});
})



