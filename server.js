//Import
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const methodOverride = require("method-override"); //This package (method-override) allows us to use DELETE and PUT HTTP route methods (since HTML form's attribute of method can only pass POST or GET actions)
const morgan = require("morgan");
const Car = require("./models/car.js");

//Connect to Database
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", ()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

//Middleware
app.use(methodOverride("_method")); //Mounting it to our express instance
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
        console.log(newCar.message)
        res.redirect("/index");
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

    //Edit Car Show Page
app.get("/index/:id/edit", async (req, res)=>{
    const id = req.params.id;
    const carList = await Car.find()
    let carMake;
    carList.forEach((car)=>{
        carMake = car.make;
    })
    console.log(carMake)
    res.render("edit-car.ejs", {
        id, //It's shorthand syntax for id:id
        make: carMake //trying to display value placeholders
    })
})

    //Edit Car Submission Request
app.put("/index/:id/edit", async (req, res)=>{
    const id = req.params.id;
    if(req.body.domestic === "on"){
        req.body.domestic = true;
    }else{
        req.body.domestic = false;
    }
    const carSingle = await Car.findByIdAndUpdate(
        id,
        {make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        domestic: req.body.domestic,
        message: req.body.message},
        {new: true}
    )
    console.log(carSingle);
    res.redirect(`/index/${id}`)
})

    //Delete Car
// app.post("/index/:id", async (req, res)=>{
//     const id = req.params.id;
//     const deletedCar = await Car.findByIdAndDelete(id);
//     console.log(deletedCar);
//     res.redirect("/index");
// })

        //We need to use the middleware function of "methodoverride", so we can use this app.delete route (Also, we need to add a query parameter in the action attribute of the <form> element of "?_method=DELETE" and keep the method to POST)
app.delete("/index/:id", async (req, res)=>{
    const id = req.params.id;
    const deletedCar = await Car.findByIdAndDelete(id);
    console.log(deletedCar);
    res.redirect("/index");
}) 