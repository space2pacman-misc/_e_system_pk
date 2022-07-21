import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        counterparties: [],
        checksReport: {}
    },
    mutations: {
        counterparties(state, payload) {
            const counterparty = state.counterparties.find(counterparty => counterparty.id === payload.id);

            if (counterparty) {
                const index = state.counterparties.indexOf(counterparty);

                state.counterparties.splice(index, 1);
            } else {
                state.counterparties.push(payload);
            }
        }
    },
    getters: {
        counterpartiesId(state) {
            return state.counterparties.map(counterparty => counterparty.id);
        },
        counterparties(state) {
            return state.counterparties;
        }
    }
});