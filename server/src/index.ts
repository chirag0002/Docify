import express, { Request, Response } from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import { router } from "./routes";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8081

app.use(cors())
app.use(express.json());

app.use('/api/v1', router)

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
})
