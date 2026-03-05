require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const recordRoutes = require("./routes/records");

app.use(cors({
   origin: ['http://localhost:5500', "http://127.0.0.1:5500"], // your frontend URL (e.g. Live Server default)
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use("/api/v1/records", recordRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));