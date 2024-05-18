import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
import cors from 'cors';

require('dotenv').config();


let app = express();
app.use(cors({ credentials: true, origin: true }));
//config app

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


viewEngine(app);
initWebRoutes(app);

connectDB();

let PORT = process.env.PORT || 6989;
//port === underfined => port = 6969

app.listen(PORT, () => {
    console.log("backend Nodejs is runing on ther port: " + PORT)
})