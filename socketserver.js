import dotenv from "dotenv";
import express from "express";
import http from "http";
import { connect } from "./db/index.js";
import { validateRequest } from "./helpers/validateRequest.js";
import { sendSocketEventsValidationSchema } from "./routes/sendSocketEventsValidationSchema.js";
import sendSocketEvents from "./routes/sentSocketEvents.js";
import { createSocketConnection } from "./socket/socket.js";

const app = express();
const PORT_HTTP = 80;
const PORT_HTTPS = 443;

dotenv.config();
connect();

// Define your HTTPS server options with the correct domain name.
// const httpsOptions = {
//   key: fs.readFileSync(
//     "/etc/letsencrypt/live/messagingsocket.worke.io/privkey.pem"
//   ),
//   cert: fs.readFileSync(
//     "/etc/letsencrypt/live/messagingsocket.worke.io/fullchain.pem"
//   ),
// };

const httpServer = http.createServer(app);
// const httpsServer = https.createServer(httpsOptions, app);

createSocketConnection(httpServer);
// createSocketConnection(httpsServer);

app.use(express.json());

app.get("/", (req, res) => {
  console.log("HTTP server is running");
  res.send("HTTP socket service");
});

app.post(
  "/send-socket-events",
  sendSocketEventsValidationSchema,
  validateRequest,
  sendSocketEvents
);

httpServer.listen(PORT_HTTP, () => {
  console.log(`HTTP server is running on port ${PORT_HTTP}`);
});

// httpsServer.listen(PORT_HTTPS, () => {
//   console.log(`HTTPS server is running on port ${PORT_HTTPS}`);
// });
