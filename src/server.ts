import 'dotenv/config';
import config from './config/env.config';
import app from './config/app.config';

// import * as http from 'http';
import * as Sentry from '@sentry/node';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';

// declare metadata by @controller annotation
import './common/dummy/controllers/dummy.controller';
import { myContainer } from './config/inversify.config';

Sentry.init({
	dsn: config.SENTRY_URL,
	tracesSampleRate: 1.0,
});

// const server: http.Server = http.createServer(app);
const port = config.PORT;

// server.on('error', (error) => {
// 	Sentry.captureException(error);
// });

let server = new InversifyExpressServer(myContainer, null, null, app);
// server.setConfig((a) => {
// 	// add body parser
// 	//   app.use(bodyParser.urlencoded({
// 	//     extended: true
// 	//   }));
// 	//   app.use(bodyParser.json());
// 	console.log(a);
// });

// let app = server.build();

export default server.build().listen(port, () => {
	console.log(`Server listening on port ${port}...`);
	console.log(`Environment - ${config.NODE_ENV}`);
});
