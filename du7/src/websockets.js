import { WebSocketServer, WebSocket } from "ws";
import ejs from "ejs";
import { db, getAllTodos } from "./db.js";

const connections = new Map();

export const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    connections.set(socket, { todoId: null });

    socket.on("message", (message) => {
      const data = JSON.parse(message);
      if (data.type === "viewing") {
        const connectionData = connections.get(socket);
        connectionData.todoId = data.todoId;
        connections.set(socket, connectionData);
      }
    });

    socket.on("close", () => {
      connections.delete(socket);
    });
  });
};

export const sendTodoListToAllConnections = async () => {
  const todos = await getAllTodos();
  const todoList = await ejs.renderFile("views/_todos.ejs", { todos });

  connections.forEach((data, socket) => {
    if (data.todoId === null) {
      socket.send(JSON.stringify({ type: "todoList", html: todoList }));
    }
  });
};

export const sendTodoDetails = async (todoId) => {
  const todo = await db("todos").where("id", todoId).first();
  const todoDetail = await ejs.renderFile("views/_todoDetails.ejs", { todo });

  connections.forEach((data, socket) => {
    if (data.todoId === todoId) {
      socket.send(
        JSON.stringify({
          type: "todoDetails",
          todoId: todoId,
          html: todoDetail,
        })
      );
    }
  });
};
