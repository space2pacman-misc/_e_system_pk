<template>
    <div class="steps">
        <div class="steps__buttons" :class="buttonsClasses">
            <slot v-for="(item, index) in items" name="button" :item="item" :index="index" />
        </div>
        <div>
            <slot name="card" :item="items[index]" />
        </div>
    </div>
</template>

<script>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Steps extends Vue {
    @Prop() items;
    @Prop() index;
    @Prop() buttonsClasses;
}
</script>

<style lang="scss" scoped>
.steps {
    &__buttons {
        display: flex;
        justify-content: space-between;
        overflow: hidden;
    }
}
</style>