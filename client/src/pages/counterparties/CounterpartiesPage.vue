<template>
    <div>
        <div v-if="counterparty" class="mt-3">
            <b-card :title="counterparty.name" :sub-title="`ИНН: ${counterparty.inn}`">
                <div class="mt-4 mb-4">
                    <b-button variant="primary" @click="edit" class="me-2">Редактировать</b-button>
                    <b-button :variant="isPresentInСheck() ? 'danger' : 'success'" @click="addToCheck">
                        <b-icon-check-square  />
                        <span class="ms-2">{{ isPresentInСheck() ? 'Убрать из проверки' : 'Добавить к проверке' }}</span>
                    </b-button>
                </div>
                <b-card-text>
                    Комментарий:
                    <b-form-textarea
                        id="textarea"
                        v-model="counterparty.description"
                        placeholder="Введите текст комментария"
                        rows="3"
                        max-rows="6" />
                </b-card-text>
                <div>
                    <b-table striped hover :items="checks" class="align-middle"></b-table>
                </div>
            </b-card>
        </div>
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class CounterpartiesPage extends Vue {
    counterparty = null;
    checks = null;

	async created() {
        const id = this.$route.params.id;
        const response = await fetch(`http://localhost:81/entrepreneur/${id}/`);
        const result = await response.json();
        
        this.counterparty = result.data.client[0];
        this.checks = result.data.checks;
    }

    async edit() {
        const response = await fetch(`http://localhost:81/entrepreneur/edit/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.counterparty)
        });
        const result = await response.json();

        if (result.status === 'success') {
            this.$bvToast.toast('Запись успешно изменена', {
				title: 'Успешно',
				autoHideDelay: 5000,
				variant: 'success',
				solid: true
			});
            this.counterparty = result.data[0];
        } else {
            this.$bvToast.toast(this.$translator.translate(result.message), {
				title: 'Ошибка',
				autoHideDelay: 5000,
				variant: 'danger',
				solid: true
			});
        }
    }

    isPresentInСheck() {
        return this.$store.getters.counterpartiesId.includes(this.counterparty.id);
    }

    addToCheck() {
        this.$store.commit('counterparties', this.counterparty);
    }
}
</script>
