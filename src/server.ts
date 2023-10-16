import http from 'http';
import app from './index';
import { init } from './socket';

const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})

init(server);