import { App } from './config/app.config';

const app = new App();

// TODO - Init and close database connection

(async () => {
	console.log('================================');
	await app.start();
	await app.initialiseLoggers();
	await app.registerParsers();
	await app.registerRoutes();
	await app.registerMiddleware();
})()
	.catch(async (error) => {
		console.log(error);
		await app.stop();
		process.exit(0);
	})
	.finally(() => console.log('================================'));
