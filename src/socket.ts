import http from "http";
import { Server } from "socket.io";

// import "sweetalert2/dist/sweetalert2.css";

let io: Server;

let products: Array<any> = [];

export const init = (httpServer: http.Server) => {
  io = new Server(httpServer);

  io.on("connection", () => {});

  console.log("Server socket running 🚀");
};

export const emitFromApi = (event: string, data: any) => io.emit(event, data);
