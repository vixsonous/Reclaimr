import express, { json, urlencoded } from 'express';
import router from './routes';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors({
  origin: `${process.env.FRONTEND_BASE_URL}:${process.env.FRONTEND_PORT}`
}));

app.use(json());
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(urlencoded({extended: true}));
app.use('/api', router);

app.listen(PORT, () => {
  console.log('The server is now listening on port ' + PORT);
});