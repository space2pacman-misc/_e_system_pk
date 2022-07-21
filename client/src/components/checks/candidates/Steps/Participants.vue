<template>
    <div>
        <div>
            <b-table :items="counterparties" class="align-middle">
                <template v-slot:cell(id)="data">
                    <b-button variant="danger" @click="remove(data.value)">
                        <b-icon-trash />
                    </b-button>
                </template>
            </b-table>
        </div>
        <b-button variant="success" @click="finish">Отправить</b-button>
    </div>
</template>

<script>
import { Component, Vue, Emit } from 'vue-property-decorator';

@Component
export default class Participants extends Vue {
    @Emit('finish')
    finish() {}

    remove(id) {
        const counterparty = this.$store.state.counterparties.find(counterparty => counterparty.id === id);

        if (counterparty) {
            const index = this.$store.state.counterparties.indexOf(counterparty);

            this.$store.state.counterparties.splice(index, 1);
        }
    }

    created() {
       this.counterparties = this.$store.state.counterparties;
       
    //    .map(counterparty => {
    //        return {
    //            value: counterparty.id,
    //            text: counterparty.name
    //        }
    //    });
    }
}
</script>

<style scoped>
.custom-select {
    display: inline-block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem 1.75rem .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    vertical-align: middle;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
</style>