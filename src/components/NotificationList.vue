<template>	
    <button type="button" class="layout-topbar-action" @click="toggle">
		<i :class="['pi pi-bell ', { 'pi-vibrate': vibrate, 'no-notification': numero_notificaciones == '' }]"></i>
	</button>
	<OverlayBadge :value="numero_notificaciones" severity="danger" size="small" class="notificabadge"></OverlayBadge>
	<!-- :value="numero_notificaciones" -->
	<Popover ref="list" appendTo="body">
		<div class="flex flex-column gap-3 w-30rem">
			<div class="flex justify-between align-items-center mb-3">
				<span class="text-2xl font-semibold text-secondary">Notificaciones<button class="p-link" @click="goatsc" style="color:white">..</button></span>
				<Button text rounded @click="markAllAsRead" icon="pi pi-check-circle" style="background-color: #fff;" v-tooltip="'Marcar todas como leídas'" />
			</div>
			<DataTable v-model:selection="selectedNotification" :rowClass="rowClass" :bodyClass="rowClass" :value="notificaciones" selectionMode="single" @row-select="onNotificationSelect">
                <Column>
                    <template #body="slotProps">
						<div :class="{'unread': !slotProps.data.leido}">
							<strong><div class="text-sm text-color-secondary">{{ slotProps.data.descripcion }}</div></strong>
							<strong><div class="text-sm text-color-secondary">{{ slotProps.data.titulo }}</div></strong>
							<div class="text-sm text-color-secondary">
								{{ slotProps.data.tarjeta_id }}. {{ slotProps.data.titulo_tarjeta }}
							</div>
							<div class="text-sm text-color-secondary">{{ slotProps.data.fecha }}</div>
						</div>
                    </template>
                </Column>
				<Column>
                    <template #body="slotProps">
                        <MenuNotification :notificacion="slotProps.data" @datos="recibirValor"/>
                    </template>
                </Column>
            </DataTable>      
		</div>		
		<Paginator :rows="5" :totalRecords="totalItems" @page="onPage($event)"></Paginator>
	</Popover>
	
    <FormTarjeta :tarjeta="tarjeta_notificacion" :tablero_id="tablero_id_notificacion" :tarjetaDialog="visible" @datos="recibirValorTarjeta" />
	
</template>

<script>
import FormTarjeta from '@/components/FormTarjeta.vue';
import MenuNotification from '@/components/MenuNotification.vue';
import { createChannelConection, sendRequest, sendRequestList } from '@/helper';

const url = import.meta.env.VITE_APP_BASE_URL;

export default {
	components: {
       MenuNotification,
       FormTarjeta
    },
	data(){
        return{
			notificaciones: [],
			vibrate: false,
			notificacion: null,
			totalItems: 0,
			page: 0,
			selectedNotification: null,
			visible: false,
			tarjeta_notificacion: {},
			tablero_id_notificacion: "",
			numero_notificaciones: "",
			// notificationAudio: new Audio(require('@/assets/sounds/notification.mp3')),
			notificationAudio: new Audio(new URL('./assets/sounds/notification.mp3', import.meta.url)),
			// goat: new Audio(require('@/assets/sounds/goat.mp3'))
			goat: new Audio(new URL('./assets/sounds/goat.mp3', import.meta.url)),

		}
	},
	methods: {
		async markAllAsRead() {
            await sendRequest('PUT', {}, url + '/leido_notificaciones_all', true);
            this.notificaciones.forEach(noti => noti.leido = 1);
            this.filterNotifications(); // Filtrar después de marcar todo como leído
        },
		playNotificationSound() {
			this.notificationAudio.play();
		},
		goatsc(event) {
			this.goat.play(event);
        },
		async recibirValor(datos) {
            if (datos.ocultar) {
				this.notificaciones = this.notificaciones.filter(noti => noti.id !== datos.id);
                const result = await sendRequestList(url+"/notificaciones?page="+this.page);
                this.notificaciones = result.data.data;
				this.countNotificaciones();
			}
		},
		async recibirValorTarjeta(datos) {
            this.visible = datos.visible;
            if (datos.columna) {
                this.moveCard(this.tarjeta_notificacion, datos.columna, 0);
            }
        },
		addNotification(data) {
			this.notificaciones.push(data);
			this.vibrate = true;
		},
		toggle(event) {
            this.$refs.list.toggle(event);
			this.vibrate = false;
			this.getNotificaciones();
        },
		async getNotificaciones(){
          const result = await sendRequestList(url+"/notificaciones");
          this.notificaciones = result.data.data;
          this.totalItems = result.data.meta.total;             
        },
		async onPage(event) {
          this.page = event.page + 1;          
          const result = await sendRequestList(url+"/notificaciones?page="+this.page);
          this.notificaciones = result.data.data;
        },
		async onNotificationSelect(event) {
			this.notificacion = event.data;
			const result = await sendRequest('PUT', {}, url+"/leido_notificaciones/"+this.notificacion.id, true);
			this.countNotificaciones();
			if (result.data.tarjeta != null) {
				this.tarjeta_notificacion = result.data.tarjeta;
				this.tablero_id_notificacion = ""+result.data.tablero_id;
				this.visible = true;
			}
		},		
		rowClass(data) {
            return [{ 'surface-50': data.leido == 0 }];
        },
		async countNotificaciones() {
			const result = await sendRequest('GET', {}, url+"/count_notificaciones", true);
			this.numero_notificaciones = result > 0 ? result : "";
		},
		async moveCard(tarjeta, new_column, new_index) {
			var result = "";        
			var params = {
			new_column: new_column,
			new_index: new_index          
			};
			result = await sendRequest(
				"PUT",
				params,
				url+"/switchcards/"+tarjeta.id
			);
			if(result != "ok") {
				this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
			}
        },
	},
	mounted() {
		this.getNotificaciones();
		this.countNotificaciones();		

		const channel = createChannelConection();
		
		if (!channel) {
			console.error("No se pudo crear el canal. Verifica si el usuario está autenticado correctamente.");
			return;
		}
		
		window.Echo.channel(channel)
			.listen("Notificacion", (e) => {
				this.addNotification(e.data);
				this.countNotificaciones();
				this.playNotificationSound();
			});
	}
};

</script>

<style scoped>
.layout-topbar .layout-topbar-action {
	color: white !important;
}

.notificabadge {
    top: .5rem !important;
    right: 1.5rem !important;
}

@keyframes vibrate {
	0% { transform: translateX(0); }
	25% { transform: translateX(-2px); }
	50% { transform: translateX(2px); }
	75% { transform: translateX(-2px); }
	100% { transform: translateX(0); }
  }
  
.pi-vibrate {
	animation: vibrate 0.3s linear infinite;
}

/* .custom-bell {
  font-size: 18px; 
  color: #fff;
  top: 10px; 
} */

.no-notification span{
  display: none;
}

/* .surface-50 {
    font-weight: bold; 
    background-color: #f2f2f2f0 !important;
} */
.unread {
	border-left: 5px solid #E20613;
    padding-left: 10px;
}


</style>