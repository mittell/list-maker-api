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

describe('list endpoints', function () {
	let request: supertest.SuperAgentTest;

	let accessToken = '';
	//@ts-ignore
	let refreshToken = '';

	let dummyUser = {
		id: '',
		email: 'dummy@email.com',
		username: 'dummy',
		password: 'dummy1',
	};

	let dummyList = {
		id: '',
		title: 'Test List',
		description: 'The description of Test List',
		userId: '',
	};

	before(async function () {
		await app.start();
		await app.startMongooseConnection();
		await app.initialiseLoggers();
		await app.registerParsers();
		await app.registerRoutes();
		await app.registerMiddleware();

		request = supertest.agent(app.server);

		const resCreate = await request.post('/api/v1/users').send(dummyUser);

		dummyUser.id = resCreate.body.id;
		dummyList.userId = resCreate.body.id;

		const resLogin = await request.post('/api/v1/users/login').send({
			email: dummyUser.email,
			password: dummyUser.password,
		});

		accessToken = resLogin.body.accessToken;
		refreshToken = resLogin.body.refreshToken;
	});

	after(async function () {
		await request
			.delete(`/api/v1/users/${dummyUser.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();
		await app.stop();
		await app.stopMongooseConnection();
	});

	// Create List - Invalid - Credentials
	it('should return 401 on POST with invalid credential data to /api/v1/lists', async function () {
		const res = await request.post('/api/v1/lists').send(dummyList);

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Create List - Invalid - Request
	it('should return 406 on POST with invalid request data to /api/v1/lists', async function () {
		const res = await request
			.post('/api/v1/lists')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Create List - Valid
	it('should return 201 on POST with valid data to /api/v1/lists', async function () {
		const res = await request
			.post('/api/v1/lists')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyList);

		expect(res.status).to.equal(201);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.id).to.be.a('string');

		dummyList.id = res.body.id;
	});

	// Get Lists - Invalid - Credentials
	it('should return 401 on GET with invalid credential data to /api/v1/lists', async function () {
		const res = await request.get('/api/v1/lists').send();

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Get Lists - Valid
	it('should return 200 on GET with valid data to /api/v1/lists', async function () {
		const res = await request
			.get('/api/v1/lists')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(200);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.page).to.be.a('number');
		expect(res.body.page).to.be.equal(0);
		expect(res.body.limit).to.be.a('number');
		expect(res.body.limit).to.be.equal(10);
		expect(res.body.lists).to.be.an('array');
		expect(res.body.lists[0]).not.to.be.empty;
	});

	// Get Lists - Valid - Limit/Page 1
	it('should return 200 on GET with valid data to /api/v1/lists?limit=1&page=1', async function () {
		const res = await request
			.get('/api/v1/lists?limit=1&page=1')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(200);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.page).to.be.a('number');
		expect(res.body.page).to.be.equal(1);
		expect(res.body.limit).to.be.a('number');
		expect(res.body.limit).to.be.equal(1);
		expect(res.body.lists).to.be.an('array');
		expect(res.body.lists[0]).to.be.undefined;
	});

	// Get Lists - Valid - Limit/Page 2
	it('should return 200 on GET with valid data to /api/v1/lists?limit=1&page=0', async function () {
		const res = await request
			.get('/api/v1/lists?limit=1&page=0')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(200);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.page).to.be.a('number');
		expect(res.body.page).to.be.equal(0);
		expect(res.body.limit).to.be.a('number');
		expect(res.body.limit).to.be.equal(1);
		expect(res.body.lists).to.be.an('array');
		expect(res.body.lists[0]).not.to.be.empty;
	});

	// Get List - Invalid - Credentials
	it('should return 401 on GET with invalid credential data to /api/v1/lists/:id', async function () {
		const res = await request.get(`/api/v1/lists/${dummyList.id}`).send();

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Get List - Invalid - Request
	it('should return 404 on GET with invalid request data to /api/v1/lists/:id', async function () {
		const res = await request
			.get(`/api/v1/lists/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(404);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Get List - Valid
	it('should return 200 on GET with valid data to /api/v1/lists/:id', async function () {
		const res = await request
			.get(`/api/v1/lists/${dummyList.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(200);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.id).to.be.a('string');
		expect(res.body.id).to.be.equal(dummyList.id);
		expect(res.body.listsItems).to.be.undefined;
	});

	// Get List - Valid - ListItems 1
	it('should return 200 on GET with valid data to /api/v1/lists/:id?listItems=true', async function () {
		const res = await request
			.get(`/api/v1/lists/${dummyList.id}?listItems=true`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(200);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.id).to.be.a('string');
		expect(res.body.id).to.be.equal(dummyList.id);
		expect(res.body.listItems).to.be.an('array');
	});

	// Patch List - Invalid - Credentials
	it('should return 401 on PATCH with invalid credential data to /api/v1/lists/:id', async function () {
		const res = await request.patch(`/api/v1/lists/${dummyList.id}`).send({
			title: dummyList.title,
			description: dummyList.description,
		});

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Patch List - Invalid - Request
	it('should return 406 on PATCH with invalid request data to /api/v1/lists/:id 1', async function () {
		const res = await request
			.patch(`/api/v1/lists/${dummyList.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Patch List - Invalid - Request
	it('should return 404 on PATCH with invalid request data to /api/v1/lists/:id 2', async function () {
		const res = await request
			.patch(`/api/v1/lists/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({
				title: dummyList.title,
				description: dummyList.description,
			});

		expect(res.status).to.equal(404);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Patch List - Valid
	it('should return 204 on PATCH with valid data to /api/v1/lists/:id', async function () {
		const res = await request
			.patch(`/api/v1/lists/${dummyList.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({
				title: dummyList.title,
				description: dummyList.description,
			});

		expect(res.status).to.equal(204);
		expect(res.body).to.be.empty;
	});

	// Put List - Invalid - Credentials
	it('should return 401 on PUT with invalid credential to /api/v1/lists/:id', async function () {
		const res = await request
			.put(`/api/v1/lists/${dummyList.id}`)
			.send(dummyList);

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put List - Invalid - Request
	it('should return 406 on PUT with invalid request data to /api/v1/lists/:id 1', async function () {
		const res = await request
			.put(`/api/v1/lists/${dummyList.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put List - Invalid - Request
	it('should return 404 on PUT with invalid request data to /api/v1/lists/:id 2', async function () {
		const res = await request
			.put(`/api/v1/lists/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyList);

		expect(res.status).to.equal(404);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put List - Invalid - Request
	it('should return 406 on PUT with invalid request data to /api/v1/lists/:id 3', async function () {
		const res = await request
			.put(`/api/v1/lists/${dummyList.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({
				title: dummyList.title,
			});

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put List - Valid
	it('should return 204 on PUT with valid data to /api/v1/lists/:id', async function () {
		const res = await request
			.put(`/api/v1/lists/${dummyList.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyList);

		expect(res.status).to.equal(204);
		expect(res.body).to.be.empty;
	});

	// Delete List - Invalid - Credentials
	it('should return 401 on DELETE with invalid credential data to /api/v1/lists/:id', async function () {
		const res = await request
			.delete(`/api/v1/lists/${dummyList.id}`)
			.send();

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Delete List - Invalid - Request
	it('should return 404 on DELETE with invalid request data to /api/v1/lists/:id', async function () {
		const res = await request
			.delete(`/api/v1/lists/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(404);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Delete List - Valid
	it('should return 204 on DELETE with valid credential data to /api/v1/lists/:id', async function () {
		const res = await request
			.delete(`/api/v1/lists/${dummyList.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(204);
		expect(res.body).to.be.empty;
	});
});

describe('listItem endpoints', function () {
	let request: supertest.SuperAgentTest;

	let accessToken = '';
	//@ts-ignore
	let refreshToken = '';

	let dummyUser = {
		id: '',
		email: 'dummy@email.com',
		username: 'dummy',
		password: 'dummy1',
	};

	let dummyList = {
		id: '',
		title: 'Test List',
		description: 'The description of Test List',
		userId: '',
	};

	let dummyListItem = {
		id: '',
		title: 'Test List Item',
		description: 'The description of Test List Item',
		isComplete: false,
		listId: '',
	};

	before(async function () {
		await app.start();
		await app.startMongooseConnection();
		await app.initialiseLoggers();
		await app.registerParsers();
		await app.registerRoutes();
		await app.registerMiddleware();

		request = supertest.agent(app.server);

		const resCreate = await request.post('/api/v1/users').send(dummyUser);

		dummyUser.id = resCreate.body.id;
		dummyList.userId = resCreate.body.id;

		const resLogin = await request.post('/api/v1/users/login').send({
			email: dummyUser.email,
			password: dummyUser.password,
		});

		accessToken = resLogin.body.accessToken;
		refreshToken = resLogin.body.refreshToken;

		const resList = await request
			.post('/api/v1/lists')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyList);

		dummyList.id = resList.body.id;
		dummyListItem.listId = resList.body.id;
	});

	after(async function () {
		await request
			.delete(`/api/v1/lists/${dummyList.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();
		await request
			.delete(`/api/v1/users/${dummyUser.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();
		await app.stop();
		await app.stopMongooseConnection();
	});

	// Create ListItem - Invalid - Credentials
	it('should return 401 on POST with invalid credential data to /api/v1/listItems', async function () {
		const res = await request.post('/api/v1/listItems').send(dummyListItem);

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Create ListItem - Invalid - Request Details
	it('should return 406 on POST with invalid request data to /api/v1/listItems 1', async function () {
		const res = await request
			.post('/api/v1/listItems')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({});

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Create ListItem - Invalid - Request List
	it('should return 404 on POST with invalid request data to /api/v1/listItems 2', async function () {
		const res = await request
			.post('/api/v1/listItems')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({
				id: dummyListItem.id,
				title: dummyListItem.title,
				description: dummyListItem.description,
				isComplete: dummyListItem.isComplete,
				listId: '12345',
			});

		expect(res.status).to.equal(404);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Create ListItem - Valid
	it('should return 201 on POST with valid data to /api/v1/listItems', async function () {
		const res = await request
			.post('/api/v1/listItems')
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyListItem);

		expect(res.status).to.equal(201);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.id).to.be.a('string');

		dummyListItem.id = res.body.id;
	});

	// Get ListItem - Invalid - Credentials
	it('should return 401 on GET with invalid credential data to /api/v1/listItems/:id', async function () {
		const res = await request
			.get(`/api/v1/listItems/${dummyListItem.id}`)
			.send();

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Get ListItem - Invalid - Request
	it('should return 404 on GET with invalid request data to /api/v1/listItems/:id', async function () {
		const res = await request
			.get(`/api/v1/listItems/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(404);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Get ListItem - Valid
	it('should return 200 on GET with valid data to /api/v1/listItems/:id', async function () {
		const res = await request
			.get(`/api/v1/listItems/${dummyListItem.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(200);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
		expect(res.body.id).to.be.a('string');

		dummyListItem.id = res.body.id;
	});

	// Patch ListItem - Invalid - Credentials
	it('should return 401 on PATCH with invalid credential data to /api/v1/listItems/:id', async function () {
		const res = await request
			.patch(`/api/v1/listItems/${dummyListItem.id}`)
			.send({
				title: dummyListItem.title,
				description: dummyListItem.description,
			});

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Patch ListItem - Invalid - Request Details
	it('should return 406 on PATCH with invalid request data to /api/v1/listItems/:id 1', async function () {
		const res = await request
			.patch(`/api/v1/listItems/${dummyListItem.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({});

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Patch ListItem - Invalid - Request List
	it('should return 404 on PATCH with invalid request data to /api/v1/listItems/:id 2', async function () {
		const res = await request
			.patch(`/api/v1/listItems/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({
				title: dummyListItem.title,
				description: dummyListItem.description,
			});

		expect(res.status).to.equal(404);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Patch ListItem - Valid
	it('should return 202 on PATCH with valid data to /api/v1/listItems/:id', async function () {
		const res = await request
			.patch(`/api/v1/listItems/${dummyListItem.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({
				title: dummyListItem.title,
				description: dummyListItem.description,
			});

		expect(res.status).to.equal(202);
		expect(res.body).to.be.empty;
	});

	// Put ListItem - Invalid - Credentials
	it('should return 401 on PUT with invalid credential data to /api/v1/listItems/:id', async function () {
		const res = await request
			.patch(`/api/v1/listItems/${dummyListItem.id}`)
			.send(dummyListItem);

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put ListItem - Invalid - Request Details
	it('should return 406 on PUT with invalid request data to /api/v1/listItems/:id 1', async function () {
		const res = await request
			.patch(`/api/v1/listItems/${dummyListItem.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({});

		expect(res.status).to.equal(406);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put ListItem - Invalid - Request List
	it('should return 404 on PUT with invalid request data to /api/v1/listItems/:id 2', async function () {
		const res = await request
			.patch(`/api/v1/listItems/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyListItem);

		expect(res.status).to.equal(404);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Put ListItem - Valid
	it('should return 202 on PUT with valid data to /api/v1/listItems/:id', async function () {
		const res = await request
			.patch(`/api/v1/listItems/${dummyListItem.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send(dummyListItem);

		expect(res.status).to.equal(202);
		expect(res.body).to.be.empty;
	});

	// Delete ListItem - Invalid - Credentials
	it('should return 401 on DELETE with valid data to /api/v1/listItems/:id', async function () {
		const res = await request
			.delete(`/api/v1/listItems/${dummyListItem.id}`)
			.send();

		expect(res.status).to.equal(401);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Delete ListItem - Invalid - Request List
	it('should return 404 on DELETE with valid data to /api/v1/listItems/:id', async function () {
		const res = await request
			.delete(`/api/v1/listItems/12345`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(404);
		expect(res.body).not.to.be.empty;
		expect(res.body).to.be.an('object');
	});

	// Delete ListItem - Valid
	it('should return 204 on DELETE with valid data to /api/v1/listItems/:id', async function () {
		const res = await request
			.delete(`/api/v1/listItems/${dummyListItem.id}`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send();

		expect(res.status).to.equal(204);
		expect(res.body).to.be.empty;
	});
});
