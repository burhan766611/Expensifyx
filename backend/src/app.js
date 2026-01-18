import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv/config';
import routes from './routes/index.js'
import { auditMiddleware } from "../middlewares/audit.middleware.js"
import cookieParser from 'cookie-parser'


const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(morgan('dev'));
app.use(auditMiddleware);
app.use("/api", routes);

app.get("/", (req, res) => {
    res.json({
        truth: "ALLAH HU AKHBAR"
    })
    return {
       "truth": "ALLAH HU AKHBAR"
    }
})

app.get("/health", (req, res) => {
    console.log("ExpensifyX API");
    res.json({
        status: "OK",
        service: "ExpensifyX API"
    })
})

export default app;