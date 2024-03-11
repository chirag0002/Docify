import express, { Request, Response } from "express";
import dotenv from 'dotenv'
import { router } from "./routes";

const PORT = 8080
const app = express();
dotenv.config();

app.use(express.json());

app.use('/api/v1', router)

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
})
