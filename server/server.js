const express = require('express');
const mysql = require('mysql2');
const helmet = require('helmet');
const cors = require('cors');
const { json } = require('body-parser');

const Driver = require('./core/Driver');
const Query = require('./core/Query');
const Payload = require('./core/Payload');
const Schema = require('./core/Schema');
const RequiredFields = require('./core/RequiredFields');
const ServiceRequest = require('./core/ServiceRequest');
const ServiceResponse = require('./core/ServiceResponse');
const TypeConverter = require('./core/TypeConverter');
const Serialization = require('./core/Serialization');
const Log = require('./core/Log');

const config = require('./config/app');
const API = require('./data/API');

// init
const db = mysql.createPool(config.db.mysql);
const app = express();
const driver = new Driver('mysql', db);
const query = new Query(driver);
const serviceRequest = new ServiceRequest();
const serviceResponse = new ServiceResponse();
const typeConverter = new TypeConverter();
const serialization = new Serialization(driver.type);
const log = new Log();
const schema = {
	'entrepreneur': new Schema({
		'checko': {
			input: API['checko'],
			output: {
				name: 'data.entrepreneurs[last].name',
				address: 'data.entrepreneurs[last].locality',
				inn: 'data.entrepreneurs[last].inn'
			}
		},
		'kontur.focus': {
			input: API['kontur.focus'],
			output: {
				inn: {
					path: '[unknow].inn',
					condition: '[unknow].IP.status.statusString = "Действующее"'
				},
				name: {
					path: '[unknow].IP.fio',
					condition: '[unknow].IP.status.statusString = "Действующее"'
				},
				ogrn: '[first].ogrn'
			}
		}
	}),
	'company': {},
	'individual': {}
};

app.use(helmet());
app.use(cors());
app.use(serviceResponse.checkHeaders('content-type', ['POST']));
app.use(json());
app.use(serviceResponse.checkInvalidJSON);

app.get('/search/', async (request, response) => {
	const section = request.query.section;
	const value = request.query.query;
	const payload = new Payload();
	const requiredFields = new RequiredFields(RequiredFields.search.get, { section, query: value });

	if (!requiredFields.state) {
		payload.add('status', 'error');
		payload.add('message', requiredFields.message);
		response.send(payload.get());

		return;
	}

	if (!config.db.section.allowed.includes(section)) {
		payload.add('status', 'error');
		payload.add('message', 'This section does not exist or access to this section is denied');
		response.send(payload.get());

		return;
	}

	const data = await query.searchByField(section, value, ['id', 'inn', 'ogrn', 'name', 'description']);

	if (!data) {
		payload.add('status', 'error');
		payload.add('message', `No results were found for: ${value}.`);
		response.send(payload.get());

		return;
	}

	payload.add('status', 'success');
	payload.add('data', data);
	response.send(payload.get());
})

app.get('/entrepreneur/verification/', async (request, response) => {
	const inn = request.query.inn;
	const payload = new Payload();
	const requiredFields = new RequiredFields(RequiredFields.entrepreneur.verification, { inn });
	const urls = {
		'checko': schema['entrepreneur'].getURL('checko', { "object": "person", "inn": inn }),
		'kontur.focus': schema['entrepreneur'].getURL('kontur.focus', { "inn": inn })
	}

	if (!requiredFields.state) {
		payload.add('status', 'error');
		payload.add('message', requiredFields.message);
		response.send(payload.get());

		return;
	}

	const responses = {
		'checko': await serviceRequest.get(urls['checko']),
		'kontur.focus': await serviceRequest.get(urls['kontur.focus']),
	}
	const resource = {
		'checko': schema['entrepreneur'].getValue(responses['checko'].response, 'checko', 'inn') ? true : false,
		'kontur.focus': schema['entrepreneur'].getValue(responses['kontur.focus'].response, 'kontur.focus', 'inn') ? true : false
	}

	payload.add('status', 'success');
	payload.add('data', resource);
	response.send(payload.get());
});

app.get('/entrepreneur/request/', async (request, response) => {
	const inn = request.query.inn;
	const payload = new Payload();
	const requiredFields = new RequiredFields(RequiredFields.entrepreneur.request, { inn });
	const urls = {
		'checko': schema['entrepreneur'].getURL('checko', { "object": "person", "inn": inn }),
		'kontur.focus': schema['entrepreneur'].getURL('kontur.focus', { "inn": inn })
	}

	if (!requiredFields.state) {
		payload.add('status', 'error');
		payload.add('message', requiredFields.message);
		response.send(payload.get());

		return;
	}

	const responses = {
		'checko': await serviceRequest.get(urls['checko']),
		'kontur.focus': await serviceRequest.get(urls['kontur.focus']),
	}
	const data = {
		address: schema['entrepreneur'].getValue(responses['checko'].response, 'checko', 'address'),
		name: schema['entrepreneur'].getValue(responses['kontur.focus'].response, 'kontur.focus', 'name'),
		ogrn: schema['entrepreneur'].getValue(responses['kontur.focus'].response, 'kontur.focus', 'ogrn'),
		inn: schema['entrepreneur'].getValue(responses['kontur.focus'].response, 'kontur.focus', 'inn')
	}

	payload.add('status', 'success');
	payload.add('data', data);
	response.send(payload.get());
});

app.get('/entrepreneur/:id/', async (request, response) => {
	const id = typeConverter.toAbsNumber(request.params.id);
	const payload = new Payload();
	const requiredFields = new RequiredFields(RequiredFields.entrepreneur.get, { id });

	if (!requiredFields.state) {
		payload.add('status', 'error');
		payload.add('message', requiredFields.message);
		response.send(payload.get());

		return;
	}

	const client = await query.getByField('clients', 'id', id, ['id', 'inn', 'ogrn', 'name', 'description']);

	if (client) {
		const checks = await query.getChecksReportByClientId(id);
		const data = {
			client,
			checks
		}

		payload.add('status', 'success');
		payload.add('data', data);
	} else {
		payload.add('status', 'error');
		payload.add('message', `Not found by id: ${id}.`);
	}

	response.send(payload.get());
});

app.get('/actives/', async (request, response) => {
	const payload = new Payload();
	const actives = await query.getSectionData('actives');

	payload.add('status', 'success');
	payload.add('data', actives);
	
	response.send(payload.get());
});

app.get('/reasons/', async (request, response) => {
	const payload = new Payload();
	const reasons = await query.getSectionData('reasons');

	payload.add('status', 'success');
	payload.add('data', reasons);
	
	response.send(payload.get());
});

app.get('/relations/types/', async (request, response) => {
	const payload = new Payload();
	const relations = await query.getSectionData(serialization.getSerializatedTableName('relations_types'));

	payload.add('status', 'success');
	payload.add('data', relations);
	
	response.send(payload.get());
});

app.get('/decisions/', async (request, response) => {
	const payload = new Payload();
	const decisions = await query.getSectionData('decisions');

	payload.add('status', 'success');
	payload.add('data', decisions);
	
	response.send(payload.get());
});

app.get('/risks/', async (request, response) => {
	const payload = new Payload();
	const risks = await query.getSectionData('n_risk_levels');

	payload.add('status', 'success');
	payload.add('data', risks);
	
	response.send(payload.get());
});

app.post('/entrepreneur/add/', async (request, response) => {
	const inn = request.body.inn;
	const name = request.body.name;
	const description = request.body.description;
	const payload = new Payload();
	const requiredFields = new RequiredFields(RequiredFields.entrepreneur.add, { inn, name });

	if (!requiredFields.state) {
		payload.add('status', 'error');
		payload.add('message', requiredFields.message);
		response.send(payload.get());

		return;
	}

	const client = await query.getByField('clients', 'inn', inn, ['inn']);

	if (client) {
		payload.add('status', 'error');
		payload.add('message', `An entry with the same inn: ${inn} already exists`);
	} else {
		const fullTextKey = `${name.toUpperCase()} ${inn}`;

		await query.add('clients', { name, inn, description, full_text_key: fullTextKey });
	
		const client = await query.getByField('clients', 'inn', inn, ['id', 'inn', 'name', 'description']);

		payload.add('status', 'success');
		payload.add('data', client);
	}
	
	response.send(payload.get());
});

app.post('/entrepreneur/edit/', async (request, response) => {
	const id = request.body.id;
	const description = request.body.description;
	const payload = new Payload();
	const requiredFields = new RequiredFields(RequiredFields.entrepreneur.edit, { id });

	if (!requiredFields.state) {
		payload.add('status', 'error');
		payload.add('message', requiredFields.message);
		response.send(payload.get());

		return;
	}

	const queryResult = await query.getByField('clients', 'id', id);

	if (queryResult) {
		await query.edit('clients', id, { 'description': description });

		const client = await query.getByField('clients', 'id', id, ['id', 'inn', 'ogrn', 'name', 'description']);
	
		payload.add('status', 'success');
		payload.add('data', client);
	} else {
		payload.add('status', 'error');
		payload.add('message', `Not found by id: ${id}.`);
	}

	response.send(payload.get());
});

app.post('/candidates/add/', async (request, response) => {
	const name = request.body.name;
	const date = request.body.date || '0000-00-00';
	const passport = request.body.passport || '';
	const position = request.body.position || '';
	const inn = request.body.inn || '';
	const payload = new Payload();
	const requiredFields = new RequiredFields(RequiredFields.candidates.add, { name, date, passport });

	if (!requiredFields.state) {
		payload.add('status', 'error');
		payload.add('message', requiredFields.message);
		response.send(payload.get());

		return;
	}

	const client = await query.getByField('clients', 'passport', passport, ['passport']);

	if (client) {
		payload.add('status', 'error');
		payload.add('message', `An entry with the same passport: ${passport} already exists`);
	} else {
		const fullTextKey = `${name.toUpperCase()} ${passport} ${inn}`;

		await query.add('clients', { name, passport, inn, full_text_key: fullTextKey, date, position, initiator: 1 });
	
		const client = await query.getByField('clients', 'passport', passport, ['id', 'passport', 'name']);

		payload.add('status', 'success');
		payload.add('data', client);
	}
	
	response.send(payload.get());
});

app.get('/candidates/unchecked/', async (request, response) => {
	const [rows] = await db.promise().query('SELECT * FROM clients WHERE POSITION IS NOT NULL AND COMMENTS IS NULL');
	
	response.send(rows);
})

app.post('/checks/report/add/', async (request, response) => {
	const activeId = request.body.activeId;
	const reasonId = request.body.reasonId;
	const initbyId = request.body.initbyId;
	const checkedbyId = request.body.checkedbyId;
	const decisionId = request.body.decisionId;
	const description = request.body.description;
	const clientId = request.body.clientId;
	const relationTypeId = request.body.relationTypeId;
	const relationTypeRiskId = request.body.relationTypeRiskId;
	const payload = new Payload();

	await query.addCheckReport({ activeId, reasonId, initbyId, checkedbyId, decisionId, description, clientId, relationTypeId, relationTypeRiskId });

	payload.add('status', 'success');
	
	response.send(payload.get());
});


app.get('/checks/report/', async (request, response) => {
	const payload = new Payload();
	
	const [rows] = await db.promise().query('SELECT * FROM CHECKS WHERE DECISION_ID = 1');
	
	response.send(rows);
});

app.listen(config.server.port, config.server.host, async () => {
	log.info(`Server listening on ${config.server.host}:${config.server.port}`);
});

process.on('uncaughtException', error => {
	if (error.code === 'EADDRINUSE') {
		log.error(`Error: address already in use ${config.server.host}:${config.server.port}`);
	}
});