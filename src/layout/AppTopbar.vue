<template>
	<div class="layout-topbar">
		<div class="layout-topbar-logo-container">
			<button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
				<i class="pi pi-bars"></i>
			</button>
			<router-link to="/home" class="layout-topbar-logo">
				<img src="/layout/images/logo-white.png" alt="Image" style="height: 20px;" class="" />
				<img src="/layout/images/logo-sinv.png" alt="Image" style="height: 30px;" class="" />
				<!-- <span>SINV</span> -->
			</router-link>
		</div>

		<div class="layout-topbar-actions ">
			<div class="slogan hidden md:block">
				<img src="/layout/images/slogan.png" alt="Image"  class="" />
			</div>
			<div class="layout-config-menu">
				<button type="button" class="layout-topbar-action" @click="toggleDarkMode">
					<i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
				</button>
				<div class="relative">
					<button
						v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
						type="button"
						class="layout-topbar-action layout-topbar-action-highlight"
					>
						<i class="pi pi-palette"></i>
					</button>
					<AppConfigurator />
				</div>
			</div>

			<button
				class="layout-topbar-menu-button layout-topbar-action"
				v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
			>
				<i class="pi pi-ellipsis-v"></i>
			</button>

			<div class="layout-topbar-menu hidden lg:block">
				<div class="layout-topbar-menu-content">
					<button type="button" class="layout-topbar-action">
						<i class="pi pi-calendar"></i>
						<span>Calendar</span>
					</button>
					<NotificationList />
					<!-- <button type="button" class="layout-topbar-action">
						<i class="pi pi-inbox"></i>
						<span>Messages</span>
					</button> -->
					<!-- <button type="button" class="layout-topbar-action">
						<i class="pi pi-user"></i>
						<span>Profile</span>
					</button> -->
					<button class="p-link layout-topbar-action" @click="toggle">
						<i class="md:hidden pi pi-user normal"></i>
						<i class="pi pi-user"></i>
						<!-- <span>Profile</span> -->
					</button>
					<Menu ref="menu" id="overlay_menu" :model="items" :popup="true" @click="logout"/>	
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>
import { logout } from '@/auth/user';
import NotificationList from '@/components/NotificationList.vue';
import { useLayout } from '@/layout/composables/layout';
import { ref } from 'vue';
import AppConfigurator from './AppConfigurator.vue';


	const { toggleDarkMode, isDarkTheme, onMenuToggle } = useLayout(); // Acceder a propiedades y métodos del composable

	// Definición de items para el menú
	const items = ref([
		{
			label: 'Salir',
			icon: 'pi pi-sign-out',
		}
	]);

	// Computed para la imagen del topbar en función del tema
	// const topbarImage = computed(() => 
	// 	isDarkTheme.value ? 'images/logo-white.png' : 'images/logo-dark.png'
	// );

	// Definir los métodos como funciones
	const handleMenuToggle = (event) => {
	onMenuToggle(event);
	};

	const handleTopbarMenuToggle = (event) => {
	// Emitir el evento personalizado (si necesitas emitir eventos personalizados desde el componente padre, podrías necesitar un ref y usar `emit`)
	};

	const toggle = (event) => {
	// Asumimos que `menu` es un ref en el DOM y `toggle` controla su visibilidad
	menuRef.value?.toggle(event);
	};

	const logoutUser = () => {
	logout();
	};

	// Ref para el menú
	const menuRef = ref(null);
</script>

<style scoped>
.slogan {
	width: 100%;
	text-align: center;
}

.layout-topbar {
    background-color: #081136;
} 

.layout-topbar .layout-topbar-action {
	color: white !important;
}

</style>