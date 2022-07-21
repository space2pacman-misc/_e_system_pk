<template>
    <div>
        <div>Имя</div>
        <input type="text" class="form-control">
        <!-- <div class="mt-3">Инициатор запроса</div>
        <input type="text" class="form-control"> -->
        <div class="mt-3">ФИО проверяемого</div>
        <input type="text" class="form-control">
        <div class="mt-3">Дата рождения</div>
        <b-form-datepicker></b-form-datepicker>
        <div class="mt-3">Паспорт</div>
        <input type="text" class="form-control">
        <!-- <div class="mt-3">Должность</div>
        <input type="text" class="form-control"> -->
        <b-button variant="success" class="mt-3 mb-3" @click="add">Добавить</b-button>
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component()
export default class CounterpartiesAdd extends Vue {
    add() {

    }
}
</script>