const SyntaxParser = require('./SyntaxParser');

/**
 * Схема для хранения адресов и получения данных API сервисов
*/
class Schema {
	/**
	 * @param {object} API Схема API
	 */
	constructor(API) {
		this._API = API;
	}

	/**
	 * Получить данные API для отправки запроса.
	 * 
	 * @param {string} name Название API.
	 * @return {object} Данные об API.
	 */
	getInputByName(name) {
		return this._API[name].input;
	}
	
	/**
	 * Получить поля API где хранятся нужные данные.
	 * 
	 * @param {string} name Название API.
	 * @return {object} Поля API.
	 */
	getOutputByName(name) {
		return this._API[name].output;
	}

	/**
	 * Получить значения из API данных.
	 * 
	 * @param {object} data Данные API.
	 * @param {string} name Название API.
	 * @param {string} field Название поля.
	 * @return {string} Значение из API.
	 */
	getValue(data, name, field) {
		const output = this.getOutputByName(name);
		const path = this._getPath(output[field]);
		const condition = this._getCondition(output[field]);

		if (condition) {
			const conditionSyntaxParser = new SyntaxParser('condition', condition);
			const conditionOperands = conditionSyntaxParser.getValue();

			for(let i = 0; i < data.length; i++) {
				let result = this._getValueByKeyList(data, conditionOperands.left.split('.'), i);

				if (result === conditionOperands.right) {
					const syntaxParser = new SyntaxParser('path', path);
					const convertedPath = syntaxParser.getValue();
					const keyList = convertedPath.split('.');
					
					return this._getValueByKeyList(data, keyList, i);
				}
			}
		} else {
			const syntaxParser = new SyntaxParser('path', path);
			const convertedPath = syntaxParser.getValue();
			const keyList = convertedPath.split('.');

			return this._getValueByKeyList(data, keyList);
		}		
	}

	_getValueByKeyList(data, items, index) {
		let value = data;

		for (let i = 0; i < items.length; i++) {
			const key = items[i];

			if(value === null) {
				return null;
			}
			
			if (key === 'unknow') {
				value = value[index];

				continue;
			}

			if (key === 'first') {
				value = value[0];
				
				continue;
			}

			if (key === 'last') {
				value = value[value.length - 1];
				
				continue;
			}

			if (value && key in value) {
				value = value[key];
			} else {
				return null;
			}
		}

		return value;
	}

	/**
	 * Собрать и получить из API данных.
	 * 
	 * @param {string} name Название API.
	 * @param {object} params URL параметры.
	 * @return {string} URL.
	 */
	getURL(name, params) {
		const API = this.getInputByName(name);
		const searchParams = new URLSearchParams(params)
		const url = `${API.protocol}://${API.address}${API.params}?${API.key.name}=${API.key.value}&${searchParams.toString()}`;

		return url;
	}

	/**
	 * Конвертирование индексов в свойства и обрезание лишних точек.
	 * 
	 * @private
	 * @param {string} string Исходный путь.
	 * @return {string} Конвертированный путь.
	 */
	_convertProperties(string) {
		return string.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, ''); // a.b[0].c => a.b.0.c
	}

	/**
	 * Получить путь API данных.
	 * 
	 * @private
	 * @param {object|string} value Объект с данными или строка с API данными. 
	 * @return {string} API путь.
	 */
	_getPath(value) {
		return typeof value === 'object' ? value.path : value;
	}

	/**
	 * Получить условие для фильтрации API данных.
	 * 
	 * @private
	 * @param {object|string} value 
	 * @return {string} API условие.
	 */
	_getCondition(value) {
		return typeof value === 'object' ? value.condition : null;
	}	
}

module.exports = Schema;