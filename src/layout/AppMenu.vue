<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        icon: 'pi pi-fw pi-chart-line', 
        to: '/dashboard',
        items: [
            { 
                label: 'Dashboard', 
                icon: 'pi pi-fw pi-chart-line', 
                to: '/dashboard', 
                visible: () => this.user.roles[0] === 'admin',
                name: "dashboard" 
            },
            { 
                label: 'MultiCotizador', 
                icon: 'pi pi-fw pi-car', 
                to: '/multicotizador', 
                name: "multi" 
            },
            { 
                label: 'DashboardVue', 
                icon: 'pi pi-fw pi-chart-line', 
                to: '/dashboardvue', 
                visible: () => this.user.roles[0] === 'admin',
                name: "dashboardvue" 
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
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
