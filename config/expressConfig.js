import express from "express";
import http from "http";

export const app = express();
app.use(express.json());

export const httpServer = http.createServer(app);
