import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import bookRoutes from "./routes/books.js";
import transactionRoutes from "./routes/transactions.js";
import categoryRoutes from "./routes/categories.js";
import statisticsRoutes from "./routes/statistics.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 4000

/* Middlewares */
app.use(express.json());
app.use(cors());

/* API Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/statistics", statisticsRoutes);

/* MongoDB connection */
mongoose.connect(
    process.env.MONGO_URL,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("MONGODB CONNECTED");
    }
  );

app.get("/", (req,res) => {
    res.status(200).send("welcome kiet");
});

app.listen(port, ()=>{
    console.log(`server is running in port ${port}`);
});

