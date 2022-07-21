class Translator {
	constructor(dictionary) {
		this._dictionary = dictionary;
	}

	translate(value) {
		const tags = {
			default: '{.*?}',
			anyCharacters: '(.*?)'
		}
		const regexp = {
			tags: new RegExp(tags.default, 'g'),
			anyCharacters: null,
		}
		const text = {
			value: this._escapingDots(value),
			tagged: {
				anyCharacters: null
			}
		}

		for(const key in this._dictionary) {
			text.tagged.anyCharacters = this._escapingDots(key).replace(regexp.tags, tags.anyCharacters);
			regexp.anyCharacters = new RegExp(text.tagged.anyCharacters);

			if (regexp.anyCharacters.test(text.value)) {
				let translation = this._dictionary[key];
				let types = this._escapingDots(key).split(regexp.anyCharacters).filter(this._isNotSpace);
				let values = text.value.split(regexp.anyCharacters).filter(this._isNotSpace);

				types.forEach((type, index) => {
					translation = translation.replace(type, values[index]);
				})

				return translation;
			}
		}

		return value;
	}

	_escapingDots(string) {
		return string.replace(/\./g, '/\.'); //eslint-disable-line
	}

	_isNotSpace(item) {
		return item !== '';
	}
}

module.exports = Translator;