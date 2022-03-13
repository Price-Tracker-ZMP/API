const express = require('express');
const app = express();
const mongoose = require('mongoose');
//TODO: take short tutorial about MONGOOSE
//TODO: make new data base
//TODO: connects outside routes to main app.js file
//TODO: remember about turn on CORS

//import routes from directory routes\
//example: const postsRoute = require('./routes/posts.js');
//TODO: main, test routes to do - for testing main connection with database and testing with Postman

//MIDDLEWARES!!!
//remember about "say to start using middleware - outside routes"
//example: app.use('/user', userRoute)

//ROUTES
//app.get('/', (req, res) => {...})

//CONNECT TO DATABASE
//TODO: Remember about adding a special variable in .env file
//mongoose.connect()...
//add comment to show in console if database connected properly

//app listening port
//TODO: not-static port listening
app.listen(3000);
