<template>
    <div>
        <div class="position-relative">
            <Search @response="onSearchResponse" />
            <b-list-group v-if="searchResponse.status === 'success' && isShowList" class="position-absolute dropdown-list" @click="onItemList()">
                <b-list-group-item v-for="(item, key) in searchResponse.data" :key="key">
                    <router-link :to="`/counterparties/${item.id}/`">{{ item.name }}</router-link>
                </b-list-group-item>
            </b-list-group>
        </div>

        <div v-if="searchResponse.status === 'error' && isShowError">{{ searchResponse.message }}</div>
        <div v-if="isShowButtonSearch" class="text-center mt-4">
            <div class="mb-3">Данные по ИНН: {{ query }} в базе даных отсутствуют</div>
            <button type="button" class="btn btn-success" @click="request">Поиск на внешнем ресурсе</button>
        </div>

        <div v-if="entrepreneur" class="mt-3">
            <b-card :title="entrepreneur.name" :sub-title="`ИНН: ${entrepreneur.inn}`">
                <b-card-text>
                    Комментарий:
                    <b-form-textarea
                        id="textarea"
                        v-model="entrepreneur.description"
                        placeholder="Введите текст комментария"
                        rows="3"
                        max-rows="6" />
                </b-card-text>
                <button type="button" class="btn btn-success" @click="add">Добавить</button>
            </b-card>
        </div>
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Search from '@/components/Search';

@Component({
	components: {
		Search
	}
})
export default class CounterpartiesSearch extends Vue {
    searchResponse = {};
	isShowList = false;
    isShowButtonSearch = false;
    query = null;
    entrepreneur = null;
    isShowError = true;

	onSearchResponse(response) {
		this.searchResponse = response;
        this.isShowButtonSearch = false;
        this.isShowError = true;

		if (this.searchResponse.status === 'error') {
			// this.$bvToast.toast(this.$translator.translate(this.searchResponse.message), {
			// 	title: 'Ошибка',
			// 	autoHideDelay: 5000,
			// 	variant: 'danger',
			// 	solid: true
			// });

            if (/^\d+$/gi.test(this.searchResponse.query)) {
                this.isShowButtonSearch = true;
                this.isShowError = false;
                this.query = this.searchResponse.query;
            }
		} else {
			if (!this.isShowList) {
				this.isShowList = false;
				this.$nextTick(() => {
					this.isShowList = true;
				})
			}
		}
	}

    async request() {
        const response = await fetch(`http://localhost:81/entrepreneur/request/?inn=${this.query}`);
		const result = await response.json();

        if (result.status === 'success') {
            this.entrepreneur = result.data;
            this.isShowButtonSearch = false;
            this.isShowError = false;
        }
    }

    async add() {
        const response = await fetch(`http://localhost:81/entrepreneur/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.entrepreneur)
        });
        const result = await response.json();

        if (result.status === 'success') {
            this.$bvToast.toast('Запись успешно добавлена', {
				title: 'Успешно',
				autoHideDelay: 5000,
				variant: 'success',
				solid: true
			});

            this.entrepreneur = null;
        } else {
            this.$bvToast.toast(this.$translator.translate(result.message), {
				title: 'Ошибка',
				autoHideDelay: 5000,
				variant: 'danger',
				solid: true
			});
        }
    }

	onItemList() {
		this.isShowList = false;
	}
}
</script>