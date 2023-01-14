import express, { Express, Request } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieparser from "cookie-parser";
import {routes} from './routes';
import config from './config/config';
import {connectToDatabase} from './database';

const app: Express = express();

// mongoDB
connectToDatabase();

// middlewares
app.set('port', config.server.port);
app.use(morgan('dev'));
app.use(cors());
app.use(cookieparser())
app.use(express.json({
  verify: (req, res, buf) => {
    if ((req as Request).originalUrl.startsWith('/stripe/webhook')) {
      (req as any).rawBody = buf.toString()
    }
  }
}))
app.use(express.urlencoded({extended: false}));

// routes
app.use(routes);

app.listen(config.server.port, () => {
  console.log(`[server]: Server is running at https://localhost:${config.server.port}`);
});
