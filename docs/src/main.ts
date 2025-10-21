import express from 'express';
import dotenv from 'dotenv';
import router from "./router";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use('/docs', router);

app.listen(PORT);
