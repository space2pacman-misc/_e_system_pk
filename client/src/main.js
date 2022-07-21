import Vue from 'vue';
import App from './App.vue';
import { BootstrapVue, IconsPlugin, ToastPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Translator from './utils/Translator';
import translation from './data/translation';
import router from './router';
import store from './store';

Vue.prototype.$translator = new Translator(translation['ru']);
Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(ToastPlugin);

new Vue({
	el: "#app",
	router,
	store,
	render(h) {
		return h(App);
	}
});