<template>
    <div>
        <b-table :items="checks" />
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component()
export default class Checks extends Vue {
    checks = null;

    async created() {
        const response = await fetch(`http://localhost:81/checks/report/`);

        this.checks = await response.json();
    }
}
</script>

<style lang="scss" scoped>
.step {
    &__button {
        &--selected {
            z-index: 2 !important;
        }
    }
}
</style>