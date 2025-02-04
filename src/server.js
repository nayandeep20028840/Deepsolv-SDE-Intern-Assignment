require("dotenv").config();
const express = require("express");
const connectDB = require("../src/config/db");
const pageRoutes = require("../src/routes/pageRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/pages", pageRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});