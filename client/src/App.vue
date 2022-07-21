<template>
	<div id="app">
		<b-container :fluid="true" class="mt-5">
			<div class="app__container" :class="{ 'app__container--compression': isSidebarOpened }">
				<Sidebar @change="onSidebar" />
				<Header />
				<div class="ps-3 pe-3 pt-2">
					<h4 class="mb-4">{{ this.$route.meta.header }}</h4>
					<router-view />
				</div>
			</div>
		</b-container>
	</div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

@Component({
	components: {
		Sidebar,
		Header
	}
})
export default class App extends Vue {
	isSidebarOpened = false;

	onSidebar(value) {
		this.isSidebarOpened = value;
	}
}
</script>

<style lang="scss">
body {
	overflow-y: scroll;
}

.app {
	&__container {
		transition: all .1s;
		padding-left: 60px;

		&--compression {
			padding-left: 300px;
		}
	}
}

// fix bootstrap-vue bugs
.b-toaster-top-right {
	right: 12px !important;
}

.toast {
	display: block !important;

	&-header {
		& .close {
			padding: 0;
			background-color: transparent;
			border: 0;
			margin-left: auto;
		}
	}
}

.close {
	float: right;
	font-size: 1.5rem;
	font-weight: 700;
	line-height: 1;
	color: #000;
	text-shadow: 0 1px 0 #fff;
	opacity: .5
}

.dropdown-list {
	top: 52px;
	width: 40%;
}
</style>
