<template>
    <div>
        <div>
            Комментарий
            <b-form-textarea
                placeholder="Комментарий..."
                rows="3"
                max-rows="6"
                class="mb-3"
                v-model="description"
            />
        </div>
        <b-button variant="success" @click="prev">Prev</b-button>
        <b-button variant="success" @click="finish">Finish</b-button>
    </div>
</template>

<script>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component
export default class Conclusion extends Vue {
    @Prop() name;

    description = '';

    @Emit('prev')
    prev() {
        return this.name;    
    }

    @Emit('finish')
    finish() {
        this.$store.state.checksReport.description = this.description;

        return this.name;    
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