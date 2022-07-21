<template>
    <div class="sidebar bg-light" :class="{ 'sidebar--wide' : _isOpened }" @click="onSidebar">
        <div class="d-flex flex-column flex-shrink-0 p-3 bg-light sidebar__column">
            <router-link to="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <img src="@/assets/logo.png" alt="" width="24" height="24" class="rounded-circle me-2 sidebar__logo">
                <span class="fs-4">ЕСПК</span>
            </router-link>
            <hr>

            <ul class="nav nav-pills flex-column mb-auto">
                <li v-for="(link, index) in links" :key="index" class="nav-item">
                    <a href="#" class="nav-link mb-2 d-flex align-items-center" :class="{ 'active': link.isActive }" @click.prevent="onClickLink(link)">
                        <b-icon :icon="link.icon" />
                        <div class="ms-2 w-100">{{ link.caption }}</div>
                        <b-icon v-if="link.sublinks" :icon="link.sublinks.state ? 'arrow-down-short' : 'arrow-up-short'" />
                    </a>

                    <div v-if="link.sublinks">
                        <ul class="list-unstyled p-2 mt-2 sidebar__nested" :class="{ 'd-none': !link.sublinks.state }">
                            <li v-for="(sublink, index) in link.sublinks.list" :key="index" :class="{ 'mb-2': index !== link.sublinks.list.length - 1 }">
                                <router-link :to="sublink.href" class="text-decoration-none p-1 ps-2 pe-2 rounded" :class="{ 'bg-info text-white': sublink.isActive }">{{ sublink.caption }}</router-link>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
            <hr>
        </div>
    </div>
</template>

<script>
import { Component, Vue, Emit, Prop, Watch } from 'vue-property-decorator';

@Component
export default class App extends Vue {
    @Prop({ default: true }) isOpened;

    _isOpened = null;

    links = [
        {
            caption: 'Главная',
            icon: 'house-fill',
            isActive: false,
            href: '/',
        },
        {
            caption: 'Поиск',
            icon: 'search',
            isActive: false,
            href: '/counterparties/search/',
        },
        {
            caption: 'Контрагенты',
            icon: 'people-fill',
            isActive: false,
            sublinks: {
                state: false,
                list: [
                    // {
                    //     caption: 'Поиск',
                    //     href: '/counterparties/search/',
                    //     isActive: false
                    // },
                    // {
                    //     caption: 'Добавить',
                    //     href: '/counterparties/add/',
                    //     isActive: false
                    // },
                    {
                        caption: 'Создать проверку',
                        href: '/counterparties/checks/create/',
                        isActive: false
                    }
                ]
            }
        },
        {
            caption: 'Кандидаты',
            icon: 'people-fill',
            isActive: false,
            sublinks: {
                state: false,
                list: [
                    // {
                    //     caption: 'Поиск',
                    //     href: '/candidates/search/',
                    //     isActive: false
                    // },
                    {
                        caption: 'Добавить',
                        href: '/candidates/add/',
                        isActive: false
                    },
                    {
                        caption: 'Создать проверку',
                        href: '/candidates/check/',
                        isActive: false
                    }
                ]
            }
        },
        {
            caption: 'Проверки',
            icon: 'check-circle',
            isActive: false,
            href: '/checks/report/'
        },
    ];

    @Watch('$route')
    changeLinkActiveState() {
        const hash = this._getHash();

        this._resetLinkState();
        this.links.forEach(link => {
            if (this.isActiveLink(link.href) || this.isActiveSublink(link.sublinks)) {
                link.isActive = true;

                if (link.sublinks) {
                    link.sublinks.state = true;
                    link.sublinks.list.forEach(sublink => {
                        if (sublink.href === hash) {
                            sublink.isActive = true;
                        }
                    })
                }
            }
        })
    }

    onClickLink(link) {
        this._resetLinkStateExcept(link); 

        if (link.sublinks) {
            this._switchSublinksState(link);
        } else {
            link.isActive = true;

            if (!this.isActiveLink(link.href)) {    
                this.$router.push(link.href);
            }
        }
    }

    isActiveLink(href) {
        const hash = this._getHash();

        if (!href) {
            return false;
        }

        if (href === hash) {
            return true;
        } else {
            return false;
        }
    }

    isActiveSublink(sublinks) {
        return sublinks && sublinks.list.find(sublink => this.isActiveLink(sublink.href))
    }

    //@Emit('change')
	onSidebar() {
		//this._isOpened = !this._isOpened;

        return this._isOpened;
	}

    @Emit('change')
    created() {
        this._isOpened = this.isOpened;
        this.changeLinkActiveState();

        return this._isOpened;
    }

    _getHash() {
        return location.hash.slice(1).split('?')[0];
    }

    _resetLinkStateExcept(activeLink) {
        this.links.forEach(link => {
            if (activeLink !== link) {
               link.isActive = false;

                if (link.sublinks) {
                    link.sublinks.state = false;
                } 
            }
        });
    }

    _resetLinkState() {
        this.links.forEach(link => {
            link.isActive = false;

            if (link.sublinks) {
                link.sublinks.state = false;
                link.sublinks.list.forEach(sublink => {
                    sublink.isActive = false;
                });
            }
        });
    }

    _switchSublinksState(link) {
        if (link.sublinks.state) {
            link.isActive = false;
            link.sublinks.state = false;
        } else {
            link.isActive = true;
            link.sublinks.state = true;
        }  
    }
}
</script>

<style lang="scss" scoped>
.sidebar {
	position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1;
    width: 60px;
	transition: all .1s;

    &__column {
        width: 300px;
    }

    &__logo {
        margin-top: 2px;
    }
    
    &__nested {
        margin-left: 28px;
        margin-top: -8px;
    }

	&--wide {
		width: 300px;
	}
}
</style>