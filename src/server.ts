import dotenv from 'dotenv';

const dotenvResult = dotenv.config();
if (dotenvResult.error) {
	throw dotenvResult.error;
}

import config from './config';

import express from 'express';
import * as http from 'http';
import cors from 'cors';
import helmet from 'helmet';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || config.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

app.get('/', (_req: express.Request, res: express.Response) => {
	res.status(200).send('Hello World!');
});

export default server.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
});
