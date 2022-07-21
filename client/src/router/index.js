import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from '@/pages/Main';
import CounterpartiesSearch from '@/pages/counterparties/Search';
import CounterpartiesAdd from '@/pages/counterparties/Add';
import CounterpartiesPage from '@/pages/counterparties/CounterpartiesPage';
import CounterpartiesChecksCreate from '@/pages/counterparties/ChecksCreate';
import CandidatesAdd from '@/pages/candidates/Add';
import CandidatesCheck from '@/pages/candidates/Check';
import ChecksReport from '@/pages/ChecksReport'

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
		{
			name: 'main',
			path: '/',
			component: Main,
			meta: {
				header: 'Главная страница'
			}
		},
		{
			name: 'CounterpartiesSearch',
			path: '/counterparties/search/',
			component: CounterpartiesSearch,
			meta: {
				header: 'Поиск контрагента'
			}
		},
		{
			name: 'CounterpartiesChecksCreate',
			path: '/counterparties/checks/create/',
			component: CounterpartiesChecksCreate,
			meta: {
				header: 'Создать проверку'
			}
		},
		{
			name: 'CounterpartiesAdd',
			path: '/counterparties/add/',
			component: CounterpartiesAdd,
			meta: {
				header: 'Добавить контрагента'
			}
		},
		{
			name: 'CounterpartiesPage',
			path: '/counterparties/:id/',
			component: CounterpartiesPage,
			meta: {
				header: 'Контрагент'
			}
		},
		{
			name: 'CandidatesAdd',
			path: '/candidates/add/',
			component: CandidatesAdd,
			meta: {
				header: 'Добавить кандидата'
			}
		},
		{
			name: 'CandidatesCheck',
			path: '/candidates/check/',
			component: CandidatesCheck,
			meta: {
				header: 'Создать проверку'
			}
		},
		{
			name: 'ChecksReport',
			path: '/checks/report/',
			component: ChecksReport,
			meta: {
				header: 'Отчеты по проверкам'
			}
		}
	]
})