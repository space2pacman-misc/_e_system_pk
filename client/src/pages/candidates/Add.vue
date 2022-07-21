<template>
    <div>
        <div class="mt-3">ФИО</div>
        <input type="text" class="form-control" v-model="name">
        <div class="mt-3">Дата рождения</div>
        <b-form-datepicker v-model="date"></b-form-datepicker>
        <div class="mt-3">Паспорт</div>
        <input type="text" class="form-control" v-model="passport">
        <div class="mt-3">Должность</div>
        <input type="text" class="form-control" v-model="position">
        <b-button variant="success" class="mt-3 mb-3" @click="add">Добавить</b-button>
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component()
export default class CandidatesAdd extends Vue {
    name = '';
    date = '';
    passport = '';
    position = '';

    async add() {
        const payload = {
            name: this.name,
            date: this.date,
            passport: this.passport,
            position: this.position
        }

        const response = await fetch(`http://localhost:81/candidates/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.status === 'success') {
            this.$bvToast.toast('Запись успешно добавлена', {
				title: 'Успешно',
				autoHideDelay: 5000,
				variant: 'success',
				solid: true
			});

            this.name = '';
            this.date = '';
            this.passport = '';
            this.position = '';
        }

        if (result.status === 'error') {
            this.$bvToast.toast(this.$translator.translate(result.message), {
				title: 'Ошибка',
				autoHideDelay: 5000,
				variant: 'danger',
				solid: true
			});
        }
    }
}
</script>