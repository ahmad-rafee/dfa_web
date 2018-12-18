const express= require('express');
const http = require('http');
const app = express();

const server = http.createServer(app);
app.use("/",express.static("."));
server.listen( process.env.PORT || 300,()=>{
    console.log("Listening...");
});