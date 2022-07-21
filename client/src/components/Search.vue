<template>
	<div class="search">
		<b-input-group>
			<b-form-input placeholder="Поиск по ИНН, ОГРН, ФИО, названию или адресу" v-model="query" />
		</b-input-group>
	</div>
</template>

<script>
import { Component, Vue, Emit, Watch } from 'vue-property-decorator';

@Component
export default class Search extends Vue {
	query = '';

	@Watch('query')
	@Emit('response')
	async search() {
		const response = await fetch(`http://localhost:81/search/?section=clients&query=${this.query}`);
		const result = await response.json();

		result.query = this.query;

		return result;
	}
}
</script>