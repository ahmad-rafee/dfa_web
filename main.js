const express= require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
app.use("/",express.static("."));
server.listen(5000 || env.PORT,()=>{
    console.log("Listening...");
});