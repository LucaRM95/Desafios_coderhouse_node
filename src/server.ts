import http from 'http';
import app from './index';
import { init } from './db/mongoose';
import env from './services/config/dotenv.config'

init();

const port = env.PORT;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})