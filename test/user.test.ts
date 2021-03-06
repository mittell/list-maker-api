import { App } from '../src/config/app.config';
import supertest from 'supertest';
import { expect } from 'chai';

// TODO - Everything is too tightly coupled, needs modularising and mocking instead!

const app = new App();

describe('user endpoints', function () {
	let request: supertest.SuperAgentTest;

	let accessToken = '';
	let refreshToken = '';

	let dummyUser = {
		id: '',
		email: 'dummy@email.com',
		username: 'dummy',
		password: 'dummy1',
	};

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

	// Create User - Invalid
	it('should return 406 on POST with invalid data to /api/v1/users', async function () {
		const res = await request.post('/api/v1/users').send({
			email: dummyUser.email,
			username: dummyUser.username,
			password: 'bad',
		});

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Create User - Valid
	it('should return 201 and access/refresh token on POST with valid data to /api/v1/users', async function () {
		const res = await request.post('/api/v1/users').send(dummyUser);

		expect(res.status).to.equal(201);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.id).to.be.a('string');

		dummyUser.id = res.body.id;
	});

	// Login User - Invalid
	it('should return 406 on POST with invalid data to /api/v1/users/login', async function () {
		const res = await request.post('/api/v1/users/login').send({
			email: dummyUser.email,
			password: 'bad',
		});

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Login User - Valid
	it('should return 200 on POST with valid data to /api/v1/users/login', async function () {
		const res = await request.post('/api/v1/users/login').send({
			email: dummyUser.email,
			password: dummyUser.password,
		});

		expect(res.status).to.equal(200);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.accessToken).to.be.a('string');
		expect(res.body.refreshToken).to.be.a('string');

		accessToken = res.body.accessToken;
		refreshToken = res.body.refreshToken;
	});

	// Refresh User Token - Invalid
	it('should return 401 on POST with invalid credential data to /api/v1/users/refresh-token', async function () {
		const res = await request
			.post('/api/v1/users/refresh-token')
			.send({ refreshToken });

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Refresh User Token - Invalid
	it('should return 400 on POST with invalid request data to /api/v1/users/refresh-token', async function () {
		const res = await request
			.post('/api/v1/users/refresh-token')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(400);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Refresh User Token - Valid
	it('should return 200 and access/refresh token on POST with valid data to /api/v1/users/refresh-token', async function () {
		const res = await request
			.post('/api/v1/users/refresh-token')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({ refreshToken });

		expect(res.status).to.equal(200);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.accessToken).to.be.a('string');
		expect(res.body.refreshToken).to.be.a('string');

		accessToken = res.body.accessToken;
		refreshToken = res.body.refreshToken;
	});

	// Get User - Invalid
	it('should return 401 on GET with invalid credential data to /api/v1/users/:id', async function () {
		const res = await request.get(`/api/v1/users/${dummyUser.id}`).send();

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Get User - Invalid
	it('should return 401 on GET with invalid request data to /api/v1/users/:id', async function () {
		const res = await request
			.get(`/api/v1/users/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Get User - Valid
	it('should return 200 on GET with valid data to /api/v1/users/:id', async function () {
		const res = await request
			.get(`/api/v1/users/${dummyUser.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(200);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.id).to.be.a('string');
		expect(res.body.id).to.be.equal(dummyUser.id);
	});

	// Patch User - Invalid
	it('should return 401 on PATCH with invalid credential data to /api/v1/users/:id', async function () {
		const res = await request
			.patch(`/api/v1/users/${dummyUser.id}`)
			.send(dummyUser);

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Patch User - Invalid
	it('should return 401 on PATCH with invalid request data to /api/v1/users/:id 1', async function () {
		const res = await request
			.patch(`/api/v1/users/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyUser);

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Patch User - Invalid
	it('should return 406 on PATCH with invalid request data to /api/v1/users/:id 2', async function () {
		const res = await request
			.patch(`/api/v1/users/${dummyUser.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Patch User - Valid
	it('should return 202 on PATCH with valid data to /api/v1/users/:id', async function () {
		const res = await request
			.patch(`/api/v1/users/${dummyUser.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyUser);

		expect(res.status).to.equal(202);
		expect(res.body).to.be.empty;
	});

	// Put User - Invalid
	it('should return 401 on PUT with invalid credential data to /api/v1/users/:id', async function () {
		const res = await request
			.put(`/api/v1/users/${dummyUser.id}`)
			.send(dummyUser);

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put User - Invalid
	it('should return 401 on PUT with invalid request data to /api/v1/users/:id 1', async function () {
		const res = await request
			.put(`/api/v1/users/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyUser);

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put User - Invalid
	it('should return 406 on PUT with invalid request data to /api/v1/users/:id 2', async function () {
		const res = await request
			.put(`/api/v1/users/${dummyUser.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put User - Invalid
	it('should return 406 on PUT with invalid request data to /api/v1/users/:id 3', async function () {
		const res = await request
			.put(`/api/v1/users/${dummyUser.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({
				email: dummyUser.email,
				password: dummyUser.password,
			});

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put User - Valid
	it('should return 202 on PUT with valid data to /api/v1/users/:id', async function () {
		const res = await request
			.put(`/api/v1/users/${dummyUser.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyUser);

		expect(res.status).to.equal(202);
		expect(res.body).to.be.empty;
	});

	// Delete User - Invalid
	it('should return 401 on DELETE with invalid credential data to /api/v1/users/:id', async function () {
		const res = await request
			.delete(`/api/v1/users/${dummyUser.id}`)
			.send();

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Delete User - Invalid
	it('should return 401 on DELETE with invalid request data to /api/v1/users/:id', async function () {
		const res = await request
			.delete(`/api/v1/users/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Delete User - Valid
	it('should return 204 on DELETE with valid credential data to /api/v1/users/:id', async function () {
		const res = await request
			.delete(`/api/v1/users/${dummyUser.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(204);
		expect(res.body).to.be.empty;
	});
});
