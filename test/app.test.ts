import { App } from '../src/config/app.config';
import supertest from 'supertest';
import { expect } from 'chai';

// TODO - Everything is too tightly coupled, needs modularising and mocking instead!

const app = new App();

describe('common endpoints', function () {
	let request: supertest.SuperAgentTest;

	before(async function () {
		await app.start();
		await app.startMongooseConnection();
		await app.initialiseLoggers();
		await app.registerParsers();
		await app.registerRoutes();
		await app.registerMiddleware();
		request = supertest.agent(app.server);
	});

	after(async function () {
		await app.stop();
		await app.stopMongooseConnection();
	});

	it('should return 200 on GET to /api/v1', async function () {
		const res = await request.get('/api/v1').send();

		expect(res.status).to.equal(200);
	});

	it('should return 404 on GET to /', async function () {
		const res = await request.get('/').send();

		expect(res.status).to.equal(404);
	});
});
