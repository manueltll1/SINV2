<template>
    <Button class="full-width" label="Recordatorio" icon="pi pi-clock" text @click="toggleShowAddReminder" :disabled="disableCheck"/>
    <Popover ref="showremainder">
        <div>
            <div class="field">
                <label class="font-bold block mb-2"> ⏰ Recordatorio </label>
                <Calendar v-model="reminder.fecharecordatorio" showTime hourFormat="12" dateFormat="dd/mm/yy"/>                
            </div>            
            <div class="field pt-40">
                <Textarea v-model="reminder.descripcion" rows="2"  autocomplete="off" placeholder="Descripción" class="w-full md:w-20rem"/> 
            </div>
            <div class="col-10 no-side-padding">
                <Button  label="Guardar" text :disabled="!formularioValido" @click="save"/>
                <Button  v-if="reminder.id" label="Cancelar" text @click="cancel"/>
                <Button  v-if="reminder.id" label="Eliminar" text @click="confirmDelete()"/>
            </div>
        </div>
        <div>
            <DataTable v-model:selection="selectedNotification" :value="remainders" selectionMode="single" @row-select="onNotificationSelect">
                <Column>
                    <template #body="slotProps">
						<span class="text-sm text-color-secondary">
							<strong>{{ slotProps.data.titulo_tarjeta }}</strong>
						</span>
						<div class="text-sm text-color-secondary">{{ slotProps.data.descripcion }}</div>
						<span class="text-sm text-color-secondary">{{ slotProps.data.fecha }}</span>
                    </template>
                </Column>				
            </DataTable>
            <Paginator :rows="2" :totalRecords="totalItems" @page="onPage($event)"></Paginator>
        </div>
    </Popover>
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="tarjeta">Realmente desea eliminar el recordatorio?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteDialog = false"/>
            <Button label="Si" icon="pi pi-check" text @click="deleteReminder" />
        </template>
    </Dialog>
</template>
<script>
    import { sendRequest } from '@/helper'; 
    const url = import.meta.env.VITE_APP_BASE_URL;   
    export default {
        props: {
            tarjeta: {
                type: Object,
                required: true
            }            
        },       
        data(){
            return{
                reminder: {},
                submitted: false,
                mensajeError: false,
                disableCheck: true,
                deleteDialog: false,
                mostrar_calendario: false,
                fecha_recordatorio: "",
                remainders: [],
                selectedNotification: null,
                totalItems: 0,
                page: 0
            }
        },
        methods: {
            onNotificationSelect(event) {
                this.reminder = event.data;
                //this.reminder.fecharecordatorio = this.reminder.fecha;
                const fecha = this.convertDate(this.reminder.fecha);
                this.reminder.fecharecordatorio = new Date(fecha);
            },
            async toggleShowAddReminder(event) {
                this.$refs.showremainder.toggle(event);
                this.reminder.titulo= null;
                this.reminder.descripcion= null;
                this.submitted = false;
                await this.getRegordatorios();
            },
            formatSave(fecha) {
                const anio = fecha.getFullYear();
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                const dia = fecha.getDate().toString().padStart(2, '0');
                const hora = fecha.getHours().toString().padStart(2, '0');
                const minuto = fecha.getMinutes().toString().padStart(2, '0');

                return `${anio}-${mes}-${dia} ${hora}:${minuto}:00`;
            },
            formatDate(dateString) {
                const [datePart, timePart] = dateString.split(' ');
                const [day, month, year] = datePart.split('/');            
                const formattedDatePart = `${year}-${month}-${day}`;

                return `${formattedDatePart} ${timePart}`;
            },
            convertDate(dateString) {
                const [datePart, timePart, modifier] = dateString.split(' ');
                const [day, month, year] = datePart.split('/');
                let [hours, minutes] = timePart.split(':');
            
                if (modifier === 'PM' && hours !== '12') {
                    hours = parseInt(hours) + 12;
                } else if (modifier === 'AM' && hours === '12') {
                    hours = '00';
                }
                
                const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
                return formattedDate;
            },
            async save() {
                this.submitted = true;                
                var fecharecordatorio ="";
                if (typeof this.reminder.fecharecordatorio == "string") {
                    fecharecordatorio = this.formatDate(this.reminder.fecharecordatorio);
                }
                if (typeof this.reminder.fecharecordatorio == "object") {
                    console.log(this.reminder.fecharecordatorio);
                    fecharecordatorio = this.formatSave(this.reminder.fecharecordatorio);
                }
                
                                
                var result = "";
                var params = {
                    titulo: "⏰ RECORDATORIO",
                    descripcion: this.reminder.descripcion,
                    fecha: fecharecordatorio,
                    tarjeta_id: this.tarjeta.id,
                    tipo: "recordatorio"
                };
                var message = "";
                if(this.reminder.id) {
                    message = "Recordatorio actualizado";
                    result = await sendRequest(
                        "PUT",
                        params,
                        url+"/notificaciones/"+this.reminder.id,
                    );
                } else {
                    message = "Recordatorio registrado";
                    result = await sendRequest(
                        "POST",
                        params,
                        url+"/notificaciones",
                    );
                }
            
                if (result === "ok") {
                    this.$refs.showremainder.hide();
                    this.submitted = false;
                    this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});                        
                    this.reminder = {};
                } else {
                    this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
                }
                
            },
            async getRegordatorios() {
                const result = await sendRequest('GET', {},url+"/recordatoriostarjeta/"+this.tarjeta.id, true);
                if(result.data) {
                    this.totalItems = result.meta.total;
                    this.remainders = result.data;
                }
            },
            async onPage(event) {
                this.page = event.page + 1;          
                const result = await sendRequest('GET', {},url+"/recordatoriostarjeta/"+this.tarjeta.id+"?page="+this.page, true);
                this.remainders = result.data;
            },
            confirmDelete() {                
                this.deleteDialog= true;
            },
            async deleteReminder() {
                const id = this.reminder.id;        
                const result = await sendRequest('DELETE', {id: id},url+"/notificaciones/"+id); 
                if (result === "ok") {
                    this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Recordatorio eliminado', life: 3000});
                } else {
                    this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
                }
                this.deleteDialog= false;
                this.reminder = {};
                this.$refs.showremainder.hide();
            },
            mostrarCalendario() {
                this.mostrar_calendario = !this.mostrar_calendario; 
            },
            cancel() {
                this.reminder = {};
            }
        },
        computed: {
            formularioValido() {        
                return this.tarjeta.id && this.reminder.fecharecordatorio ;
            },
        },
        mounted() {
            if(this.tarjeta.id) {
                this.disableCheck = false;
            }
        }
    };
</script>