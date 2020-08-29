import 'reflect-metadata';
import 'dotenv/config';

import express, { json } from 'express';
import 'express-async-errors';
import cors from 'cors';

import router from './router';
import globalAppErrorHandler from './app/middlewares/globalAppErrorHandler';
import connectToDatabase from './database';

connectToDatabase();
const app = express();

app.use(json());
app.use(cors());
app.use(router);

app.use(globalAppErrorHandler);

export default app;
