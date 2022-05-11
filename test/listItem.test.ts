import { App } from '../src/config/app.config';
import supertest from 'supertest';
import { expect } from 'chai';

// TODO - Everything is too tightly coupled, needs modularising and mocking instead!

const app = new App();

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
