const express = require('express');
const mongoose = require('mongoose');
const employeeRouter = require('./routes/employeeRoutes.js');
const companyRouter = require('./routes/companyRoutes.js')
const session = require('express-session');
require('dotenv').config();

const db = process.env.BDD_URL;
const app = express();

app.use(session({secret:process.env.SECRET,saveUninitialized: true,resave: true})); 
app.use(express.static('./assets'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(employeeRouter);
app.use(companyRouter)

app.listen(process.env.PORT,(err)=>{
    if (err) {
       console.log(err); 
    }else{
        console.log('Connected at localhost');
    }
})

mongoose.set('strictQuery', false);
mongoose.connect(db,(err)=>{
    if (err) {
        console.log(err);
    }else{
        console.log("Connected to database");
    }
})

app.all("*", (req,res)=>{
    res.redirect('/employees')
})


