/**
 * Сериализация данных для отправки и получания из базы данных.
*/
class Serialization {
    /**
     * @param {string} driverType Тип базы данных.
     */
	constructor(driverType) {
		this._driverType = driverType;
		this._schema = {
			mysql: require('./../serialization_schema/mysql')
		}
	}

    /**
     * Получение сериализованного названия поля.
     * 
     * @param {string} field - Название поля.
     * @param {string} section - Навзание раздела с записями в базе данных.
     * @example
     * MySQL: 'id' -> 'CLIENT_ID'
     * @return {string} - Сериализованное имя поля.
     */
	getSerializatedInput(field, section) {
        const name = this._schema[this._driverType]['input'][field];

        if (typeof name === 'object') {
            return name[section];
        } else {
            return name;
        } 
	}

    /**
     * Получение сериализованного название поля
     * 
     * @param {string} field - Название поля.
     * @example
     * MySQL: 'CLIENT_ID' -> 'id'
     * @return {string} - Сериализованное имя поля.
     */
	getSerializatedOutput(field) {
		return this._schema[this._driverType]['output'][field];
	}

    /**
     * Получение сериализованного название поля full text key
     * 
     * @param {string} section - Навзание раздела с записями в базе данных.
     * @example
     * MySQL: 'CLIENTS' -> 'CLIENT_NAME_FT_KEY'
     * @return {string} - Сериализованное имя поля.
     */
    getSerializatedFullTextKey(section) {
        return this._schema[this._driverType]['input']['full_text_key'][section];
    }

    /**
     * Получение сериализованного название таблицы
     * 
     * @param {string} section - Навзание раздела с записями в базе данных.
     * @example
     * MySQL: 'RELATIONS_TYPES' -> 'REL_TYPES'
     * @return {string} - Сериализованное имя таблицы.
     */
    getSerializatedTableName(section) {
        return this._schema[this._driverType]['tables'][section];
    }

    /**
     * Получение сериализованных данных для вывода
     * 
     * @param {object} data Данные, которые нужно сериализовать для вывода.
     * @param {array} fields Список полей, из которых должны состоять возвращаемые данные.
     * @example
     * MySQL:
     * [{ 'CLIENT_ID': 1, 'CLIENT_NAME': 'Alex', 'COMMENTS': 'simple comment' }] => [{ 'id': 1, 'name': 'Alex', 'description': 'simple comment' }]
     * @returns {array} Список сериализованных данных.
     */
	getPayload(data, fields) {
		const payloads = [];
		
		data.forEach(items => {
            const payload = {};

			for(let item in items) {
                const schema = this._schema[this._driverType];
                const key = item.toUpperCase();

                if (fields && fields.length > 0) {
                    if (key in schema.output && fields.includes(schema.output[key])) {
                        payload[schema.output[key]] = items[item];
                    }
                } else {
                    if (key in schema.output) {
                        payload[schema.output[key]] = items[item];
                    }
                }
			}

			payloads.push(payload);
        });

		return payloads;
	}
}

module.exports = Serialization;