import http from 'http';
import app from './index';
import mongoose from "mongoose";

const port = process.env.PORT;
const server = http.createServer(app);

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const database = "ecommerce";
const URI=`mongodb+srv://${USER}:${PASSWORD}@cluster0.khrlasb.mongodb.net/${database}`

mongoose.connect(URI)
.then(() => console.log('Connected to data base'))
.catch((err) => console.log(err));

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})