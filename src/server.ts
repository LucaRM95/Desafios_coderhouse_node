import http from 'http';
import app from './index';
import dotenv from "dotenv";
import { init } from './db/mongoose';

dotenv.config();

init();

const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})