/**
 * Класс для разбора синтаксиса в API схеме.
*/
class SyntaxParser {
    /**
     * @param {string} type Тип выражения.
     * @param {string} expression Выражение.
     */
    constructor(type, expression) {
        this._type = type;
        this._expression = expression;
        this._convertedPath = null;
        this._operands = {
            left: null,
            right: null
        };
        this._operator = {
            assignment: null,
            value: null
        }
        this._operators = {
            ' = ': 'equal',
            ' != ': 'not equal'
        }

        this._init();
    }

    /**
     * Получить назначение оператора.
     * 
     * @example
     * 'equal' или 'not equal'
     * @return {string}
     */
    getOperatorAssignment() {
        return this._operator.assignment;
    }

    /**
     * Получить список операндов.
     * 
     * @return {object}
     */
    getOperands() {
        return this._operands;
    }

    /**
     * Получить результат парсинга.
     * 
     * @return {object|string} Результат парсинга.
     */
    getValue() {
        let value;

        switch(this._type) {
            case 'condition':
                let operands = this.getOperands();

                value = {
                    left: this._convertProperties(operands.left),
                    right: this._removeQuotes(operands.right)
                };

                break;
            case 'path':
                value = this._convertedPath;

                break;
        }

        return value;
    }

    /**
     * Парсинг операторов.
     */
    _parseOperator() {
        for(let operator in this._operators) {
            if (this._expression.includes(operator)) {
                this._operator.assignment = this._operators[operator];
                this._operator.value = operator;
            }
        }
    }

    /**
     * Парсинг операндов.
     */
    _parseOperands() {
        const conditionSplitted = this._expression.split(this._operator.value);
        
        this._operands.left = conditionSplitted[0];
        this._operands.right = conditionSplitted[1];
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

    _removeQuotes(string) {
        return string.replace(/"/gi, '');
    }

    /**
     * Инициализация
     */
    _init() {
        switch(this._type) {
            case 'condition':
                this._parseOperator();
                this._parseOperands();

                break;
            case 'path':
                this._convertedPath = this._convertProperties(this._expression);

                break;
        }
        
    }
}

module.exports = SyntaxParser;