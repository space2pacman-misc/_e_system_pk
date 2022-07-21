<template>
    <div>
        <div>Актив</div>
        <b-form-select :options="actives" v-model="selectedActiveId" class="mb-3"></b-form-select>
        <div>Статус</div>
        <b-form-select :options="decisions" v-model="selectedDecisionId" class="mb-3"></b-form-select>
        <div>Причина проверки</div>
        <b-form-select :options="reasons" v-model="selectedReasonId" class="mb-3"></b-form-select>
        <div>Инициатор проверки</div>
        <b-form-select :options="[{ text: 'Билдинг Тайсу' }]" class="mb-3"></b-form-select>
        <div>Актив СБ</div>
        <b-form-select :options="[{ text: 'Тайсу' }]" class="mb-3"></b-form-select>
        <div>Проверил</div>
        <b-form-select :options="[{ text: 'Иванов Ярослав Владимирович' }]" class="mb-3"></b-form-select>
        <div>Дата заявки</div>
        <b-form-datepicker class="mb-3"></b-form-datepicker>
        <div>Дата заключения</div>
        <b-form-datepicker class="mb-3"></b-form-datepicker>
        <b-button variant="success" @click="prev">Prev</b-button>
        <b-button variant="success" @click="next">Next</b-button>
    </div>
</template>

<script>
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

@Component
export default class Data extends Vue {
    @Prop() name;

    selectedActiveId = null;
    selectedDecisionId = null;
    selectedReasonId = null;
    actives = [];
    decisions = [];
    reasons = [];

    @Emit('prev')
    prev() {
        return this.name;    
    }

    @Emit('next')
    next() {
        return this.name;
    }

    async getActives() {
        const response = await fetch(`http://localhost:81/actives/`);
        const result = await response.json();

        if (result.status === 'success') {
            this.actives = result.data.map(item => {
                return { text: item.active, value: item.id };
            });
        }
    }

    async getDecisions() {
        const response = await fetch(`http://localhost:81/decisions/`);
        const result = await response.json();

        if (result.status === 'success') {
            this.decisions = result.data.map(item => {
                return { text: item.decision, value: item.id };
            });
        }
    }

    async getReasons() {
        const response = await fetch(`http://localhost:81/reasons/`);
        const result = await response.json();

        if (result.status === 'success') {
            this.reasons = result.data.map(item => {
                return { text: item.reason, value: item.id };
            });
        }
    }

    @Watch('selectedActiveId')
    @Watch('selectedDecisionId')
    @Watch('selectedReasonId')
    saveData() {
        this.$store.state.checksReport.activeId = this.selectedActiveId;
        this.$store.state.checksReport.reasonId = this.selectedReasonId;
        this.$store.state.checksReport.initbyId = 109;
        this.$store.state.checksReport.checkedbyId = 145; // users.user_id
        this.$store.state.checksReport.decisionId = this.selectedReasonId;
    }

    async mounted() {
        await this.getActives();
        await this.getDecisions();
        await this.getReasons();
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