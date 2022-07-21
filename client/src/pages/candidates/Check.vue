<template>
    <div>
        <Steps v-if="this.$store.state.counterparties.length > 0" :items="steps" :index="step" buttons-classes="btn-group">
            <template #button="{ item, index }">
                <b-button
                    class="border border-2 shadow-none"
                    :class="getButtonClasses(item, index)"
                    :variant="getButtonStateColor(item)"
                    @click="onStepButton(index)"
                >
                    {{ item.caption }}
                </b-button>
            </template>
            <template #card="{ item }">
                <component :is="item.name" :name="item.name" @prev="onPrev" @next="onNext" @finish="onFinish" class="mt-3" />
            </template>
        </Steps>
        <div v-else>Добавьте участников для проверки</div>
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Steps from '@/components/Steps';
import Participants from '@/components/checks/candidates/Steps/Participants';

@Component({
    components: {
        Steps,
        Participants
    }
})
export default class CandidatesCheck extends Vue {
    step = 0;
    steps = [
        {
            caption: 'Участники проверки',
            name: 'Participants',
            passed: false,
            icon: ''
        }
    ];

    isSelectedStep(index) {
        return this.step === index;
    }

    passStep(index) {
        this._resetPassedSteps();
        this.steps.forEach((step, i) => {
            if (i < index) {
                step.passed = true;
            }
        });
    }

    onStepButton(index) {
        this.step = index;
        this.passStep(this.step);
        this.changeRouteStep();
    }

    getButtonStateColor(item) {
        return item.passed ? 'success' : 'light';
    }

    getButtonClasses(item, index) {
        return { 
            'border-primary step__button--selected': this.isSelectedStep(index),
            'border-success': item.passed
        };
    }

    onNext(name) {
        const step = this.steps.find(step => step.name === name);
        const index = this.steps.indexOf(step);

        this.step = index + 1;
        this.passStep(this.step);
        this.changeRouteStep();
    }

    onPrev(name) {
        const step = this.steps.find(step => step.name === name);
        const index = this.steps.indexOf(step);

        this.step = index - 1;
        this.passStep(this.step);
        this.changeRouteStep();
    }

    async onFinish() {
        const payload = {
            activeId: 3, // Merlion
            reasonId: 10, // Прием на работу
            initbyId: this.$store.state.checksReport.initbyId,
            checkedbyId: this.$store.state.checksReport.checkedbyId,
            decisionId: 1, // Рассмотрение
            description: this.$store.state.checksReport.description,
            clientId: this.$store.state.counterparties[0].id,
            relationTypeId: 64, // Прием на работу
            relationTypeRiskId: 1 // Нет данных
        }

        const response = await fetch(`http://localhost:81/checks/report/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log(response)
    }

    stepSetting() {
        const queryStep = this.$route.query.step;

        if (queryStep) {
            const step = this.steps.find(step => step.name === queryStep);

            this.step = this.steps.indexOf(step);
            this.passStep(this.step);
        } else {
            this.step = 0;
        }
    }

    changeRouteStep() {
        const queryStep = this.$route.query.step;
        const stepName = this.steps[this.step].name;

        if (queryStep !== stepName) {
            this.$router.replace({
                query: {
                    step: stepName
                }
            });
        }
    }

    mounted() {
        this.stepSetting();
        this.changeRouteStep();
    }

    _resetPassedSteps() {
        this.steps.forEach(step => step.passed = false);
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