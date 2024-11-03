<template>
	<div :class="containerClass" @click="onWrapperClick">
        <AppTopBar @menu-toggle="onMenuToggle" />
        <div class="layout-sidebar" @click="onSidebarClick">
            <AppMenu :model="menuItems" @menuitem-click="onMenuItemClick" />
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>
            <AppFooter />
        </div>

		<AppConfig :layoutMode="layoutMode" @layout-change="onLayoutChange" />
        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition>
	</div>
</template>

<script>
import AppTopBar from '../layout/AppTopbar.vue';
import AppMenu from './layout/AppMenu.vue';
import AppConfig from './layout/AppConfig.vue';
import AppFooter from './layout/AppFooter.vue';
import { useUserStore } from "@/store/user";

export default {
    emits: ['change-theme'],
    data() {
        return {
            layoutMode: 'static',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            user: useUserStore(),
            menu : [
                {
                    label: 'Home',
                    items: [
                        { 
                            label: 'Dashboard', 
                            icon: 'pi pi-fw pi-chart-line', 
                            to: '/dashboard', 
                            //visible: () => this.user.roles[0] === 'admin'
                            name: "dashboard" 
                        },
                        { 
                            label: 'DashboardVue', 
                            icon: 'pi pi-fw pi-chart-line', 
                            to: '/dashboardvue', 
                            //visible: () => this.user.roles[0] === 'admin',
                            name: "dashboardvue" 
                        },
                    ]                    
                },
				{
					label: 'Catálogos',                    
					items: [
						{
                            label: 'Usuarios', 
                            icon: 'pi pi-fw pi-id-card', 
                            to: '/users',
                            name: "users.index"
                        },
                        {
                            label: 'Roles', 
                            icon: 'pi pi-fw pi-id-card', 
                            to: '/roles',
                            name: "roles.index"
                        },
                        {
                            label: 'Permisos', 
                            icon: 'pi pi-fw pi-id-card', 
                            to: '/permissions',
                            name: "permissions.index"
                        },                        
                        {
                            label: 'Categorías',
                            icon: 'pi pi-fw pi-list',
                            to: '/categorias',
                            name: "categorias.index" 
                        },
                        {
                            label: 'Checklists',
                            icon: 'pi pi-fw pi-list',
                            to: '/checklists',
                            name: "checklists.index" 
                        },
                        {
                            label: 'Tableros',
                            icon: 'pi pi-fw pi-list',
                            to: '/tableros',
                            name: "tableros.list" 
                        },
                        {
                            label: 'Prospectos',
                            icon: 'pi pi-fw pi-id-card',
                            to: '/prospectos',
                            name: "prospectos.index" 
                        }
					]
				},
                {
                    label: 'Reglas',
                    name: "reglas",
                    items: [
                        {
                            label: 'Checklists - Columnas',
                            icon: 'pi pi-fw pi-list',
                            to: '/columnas',
                            name: "reglas.columnas.index" 
                        }
                    ]
                },
                {
                    label: 'Operación',
                    items: [
                        {
                            label: 'Tableros',
                            icon: 'pi pi-fw pi-list',
                            to: '/tablerogeneral',
                            name: "tableros.general" 
                        },
                    ]                    
                },
            ]
        }
    },
    watch: {
        $route() {
            this.menuActive = false;
            this.$toast.removeAllGroups();
        }
    },
    methods: {
        onWrapperClick() {
            if (!this.menuClick) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle() {
            this.menuClick = true;

            if (this.isDesktop()) {
                if (this.layoutMode === 'overlay') {
					if(this.mobileMenuActive === true) {
						this.overlayMenuActive = true;
					}

                    this.overlayMenuActive = !this.overlayMenuActive;
					this.mobileMenuActive = false;
                }
                else if (this.layoutMode === 'static') {
                    this.staticMenuInactive = !this.staticMenuInactive;
                }
            }
            else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }
        },
		onLayoutChange(layoutMode) {
			this.layoutMode = layoutMode;
		},
        addClass(element, className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        },
        removeClass(element, className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },
        isDesktop() {
            return window.innerWidth >= 992;
        },
        isSidebarVisible() {
            if (this.isDesktop()) {
                if (this.layoutMode === 'static')
                    return !this.staticMenuInactive;
                else if (this.layoutMode === 'overlay')
                    return this.overlayMenuActive;
            }

            return true;
        }
    },
    computed: {
        containerClass() {
            return ['layout-wrapper', {
                'layout-overlay': this.layoutMode === 'overlay',
                'layout-static': this.layoutMode === 'static',
                'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
                'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
                'layout-mobile-sidebar-active': this.mobileMenuActive,
				'p-input-filled': this.$primevue.config.inputStyle === 'filled',
				'p-ripple-disabled': this.$primevue.config.ripple === false
            }];
        },
        logo() {
            return (this.$appState.darkTheme) ? "images/logo-white.svg" : "images/logo.svg";
        },
        menuItems() {
            this.menu.map( (item) => {                
                let enable = false; 
                item.items.map((subItem) => {                    
                    if (!this.user.permissions.includes(subItem.name)) {
                        subItem.visible = false;
                    } else {
                        enable = true;
                    }
                });

                item.visible = enable;
            });

            return this.menu
        }
    },
    beforeUpdate() {
        if (this.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    },
    components: {
        'AppTopBar': AppTopBar,
        'AppMenu': AppMenu,
        'AppConfig': AppConfig,
        'AppFooter': AppFooter,
    }
}
</script>

<style lang="scss">
@import './App.scss';
</style>
