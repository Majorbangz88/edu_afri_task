import express from 'express';
import dotenv from  'dotenv';
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/mongoDb.js";

dotenv.config();
connectDB()

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use('/api/user', userRoutes);

