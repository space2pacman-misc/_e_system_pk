const Proxy = require('https-proxy-agent');
const fetch = require('node-fetch');
const config = require('./../config/app');
const proxy = new Proxy(`${config.proxy.protocol}://${config.proxy.login}:${config.proxy.password}@${config.proxy.address}:${config.proxy.port}`);

/**
 * Класс для отправки запросов на API.
*/
class ServiceRequest {
	/**
	 * Отправка запроса на API.
	 * 
	 * @param {string} url URL запроса.
	 * @return {object} объект с ответом.
	 */
	async get(url) {
		const response = await fetch(url, { agent: proxy });
		const header = response.headers.get("content-type");
		const payload = {
			status: '',
			response: null
		}

		if (header.includes('application/json')) {
			payload.status = 'success';
			payload.response = await response.json();
		} else {
			payload.status = 'error';
			payload.message = response.statusText;
		}

		return payload;
	}
}

module.exports = ServiceRequest;