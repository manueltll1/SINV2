<template>
    <div class="layout-footer">
        <img alt="Logo" :src="footerImage()" style="height: 20px;" class="mr-2" />
		<span class="font-medium ml-2">Desarrollado por INV Agente de Seguros y de Fianzas SA de CV. © Todos los derechos reservados</span>
    </div>
</template>
<!-- <script setup></script> -->
<!-- <script >
	export default {
		name: "AppFooter",
		methods: {
			footerImage() {
				return this.$appState.darkTheme ? '/layout/images/logo-white.png' : '/layout/images/logo-dark.png';
			}
		},
		computed: {
			darkTheme() {
				return this.$appState.darkTheme;
			}
		}
	}
</script> -->
<script setup>
import { computed } from 'vue';

// Computed property para detectar si el tema oscuro está activo
const darkTheme = computed(() => {
  return document.querySelector('body').classList.contains('app-dark');
});

// Función para seleccionar la imagen del logo según el tema
const footerImage = () => {
  return darkTheme.value ? '/layout/images/logo-white.png' : '/layout/images/logo-dark.png';
};
</script>