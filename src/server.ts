import http from 'http';
import app from './index';
import { init as socketInit } from './socket';
import { init } from './db/mongoose';

init();

const port = process.env.PORT;
const server = http.createServer(app);

const httpServer = server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})

socketInit(httpServer);