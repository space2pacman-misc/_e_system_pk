<template>
    <div>
        <div v-for="(counterparty, index) in counterparties" :key="index" class="mt-3 mb-3">
            <b-table :items="[ { 'Name': null, 'Relations': null, 'Risks': null } ]">
                <template v-slot:cell(Name)>
                    {{ counterparty.name }}
                </template>
                <template v-slot:cell(Relations)>
                    <b-form-select v-model="selectedRelationTypeId" :options="relationsTypes" style="width: 100%;"></b-form-select>
                </template>
                <template v-slot:cell(Risks)>
                    <b-form-select v-model="selectedRiskId" :options="risks" class="ms-2" style="width: 100%;"></b-form-select>
                </template>
            </b-table>
        </div>

        <b-button variant="success" @click="prev">Prev</b-button>
        <b-button variant="success" @click="next">Next</b-button>
    </div>
</template>

<script>
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

@Component
export default class Relationship extends Vue {
    @Prop() name;

    counterparties = [];
    relationsTypes = [];
    risks = [];
    selectedRelationTypeId = null;
    selectedRiskId = null;

    @Emit('prev')
    prev() {
        return this.name;    
    }

    @Emit('next')
    next() {
        return this.name;    
    }

    async getRelationsTypes() {
        const response = await fetch(`http://localhost:81/relations/types/`);
        const result = await response.json();

        if (result.status === 'success') {
            this.relationsTypes = result.data.map(item => {
                return { text: item.type, value: item.id };
            });
        }
    }

    async getRisks() {
        const response = await fetch(`http://localhost:81/risks/`);
        const result = await response.json();

        if (result.status === 'success') {
            this.risks = result.data.map(item => {
                return { text: item.name, value: item.id };
            });
        }
    }

    @Watch('selectedRelationTypeId')
    @Watch('selectedRiskId')
    saveData() {
        this.$store.state.checksReport.relationTypeId = this.selectedRelationTypeId;
        this.$store.state.checksReport.riskId = this.selectedRiskId;
    }

    created() {
       this.counterparties = this.$store.state.counterparties;
    }

    async mounted() {
        await this.getRelationsTypes();
        await this.getRisks();
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