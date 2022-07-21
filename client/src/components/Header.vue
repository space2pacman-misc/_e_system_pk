<template>
	<div class="header mb-3 d-flex justify-content-end align-items-center pe-3">
		<b-dropdown variant="link" toggle-class="text-decoration-none shadow-none" no-caret :right="true">
			<template #button-content>
				Иванов Ярослав
			</template>
			<b-dropdown-item href="#">Профиль</b-dropdown-item>
			<b-dropdown-item href="#">Выйти</b-dropdown-item>
		</b-dropdown>
	</div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
	
}
</script>

<style scoped>
.header {
	background: #eaeaea;
    height: 70px;
    margin-top: -48px;
    margin-left: -12px;
    margin-right: -12px;
}
</style>