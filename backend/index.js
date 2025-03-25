import express from "express"; // method-2
import dotenv from "dotenv"; 
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors"; // Correct import statement for CORS
import http from "http"; // Needed to create a server for both Express and Socket.io
import { Server } from "socket.io"; // For handling WebSocket connections

dotenv.config();

// Set up environment variables
const PORT = process.env.PORT || 5000;

// Create Express app
const app = express();

// Create an HTTP server that will also handle WebSocket connections
const server = http.createServer(app);

// Set up Socket.io instance
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,
  },
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials such as cookies or authentication headers
};

// Enable CORS middleware with specific options
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// Initialize Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Add your socket event listeners here

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Connect to the database and start the server
server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is listening on port ${PORT}`);
});
