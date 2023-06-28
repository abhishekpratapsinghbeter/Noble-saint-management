const dotenv = require("dotenv")
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const app = express();

dotenv.config({path:'./config.env'})
require("./db/conn")
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(require('./router/auth'));

const PORT = process.env.PORT || 5000;
  
if( process.env.NODE_ENV === "production"){
    app.use(express.static("frontend/build"));
    const path = require("path");
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
    });
}
app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
})