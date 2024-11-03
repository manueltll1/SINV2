<template>
    <Toast /> 
    <div class="card">
        <div v-if="can('checklists.store')">
            <Toolbar class="mb-4">
                <template #end>
                <Button label="Nueva" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />              
                </template>          
            </Toolbar>
        </div>        
        <DataTable v-model:filters="filters" :value="checklists" dataKey="id" 
            filterDisplay="row" stripedRows showGridlines :rows="20" scrollable scrollHeight="600px">

            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                        <span class="text-xl text-900 font-bold">Checklists</span>                    
                </div>            
            </template>
            <template #empty> Checklists no encontrados. </template>
            <template #loading> cargando datos de checklists. Por favor espere. </template>
            <Column field="nombre" header="Nombre" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.nombre }}
                </template>
                <template #filter>
                    <InputText id="filterName" v-model="filterName" type="text" @keydown.enter="getChecklists()" placeholder="Buscar por nombre" />
                </template>
            </Column>
            <Column field="activa" header="Estatus" style="min-width: 12rem">
                <template #body="{ data }">
                    <i class="pi" :class="{ 'pi-check-circle text-green-500': data.activa, 'pi-times-circle text-red-400': !data.activa}"></i>
                </template>
                <template #filter>
                    <TriStateCheckbox v-model="filterActiva" @change="getChecklists()" />
                </template>
            </Column>            
            <Column :exportable="false" header="Opciones" style="min-width:8rem">
                <template #body="slotProps">
                    <Button v-if="can('checklists.show')" icon="pi pi-eye" outlined rounded @click="showChecklist(slotProps.data)" />
                    <Button v-if="can('checklists.update')" icon="pi pi-pencil" outlined rounded severity="success" @click="editChecklist(slotProps.data)" />
                    <Button v-if="can('checklists.destroy') && slotProps.data.activa" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteChecklist(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
        <Paginator :rows="10" :totalRecords="totalItems" @page="onPage($event)"></Paginator>
    </div>
    <Dialog v-model:visible="checklistDialog" :style="{width: '450px'}" header="Checklist" :modal="true" class="p-fluid">
        <div class="field">
          <label for="nombre">Nombre</label>
          <InputText id="nombre" v-model.trim="checklist.nombre" required="true" :class="{'p-invalid': submitted && !checklist.nombre}" autocomplete="off" />
          <small class="p-error" v-if="submitted && !checklist.nombre">El nombre es requerido.</small>
        </div>        
        <div class="field">            
          <Checkbox v-model="checklist.activa" :binary="true" />
          <label class="ml-2"> Estatus </label>
        </div>       

        <div>
            <div v-for="(item, index) in tasks" :key="index">      
            <div class="flex align-items-center gap-2">
                {{ item.nombre }}
                <Button icon="pi pi-times" text rounded aria-label="Filter" @click="removeTask(index)" />  
            </div>
            </div>            
        </div>
        <br />
        <div class="field">
            <span class="p-float-label">            
            <Textarea v-model="task" rows="1" cols="30" autocomplete="off"/> 
            <label for="task">Tareas</label>     
            </span>
        </div>

        <div class="field">
            <Button label="Agregar" @click="addTask()" link />
        </div>        

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
            <Button label="Guardar" icon="pi pi-check" text @click="saveChecklist" />
        </template>
    </Dialog>
    <Dialog v-model:visible="deleteChecklistDialog" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="checklist">Realmente desea eliminar el checklist <b>{{checklist.nombre}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteChecklistDialog = false"/>
            <Button label="Si" icon="pi pi-check" text @click="deleteChecklist" />
        </template>
    </Dialog>
    <Dialog v-model:visible="showDialog" style="width: 28rem"  :modal="true">
      <Card style="width: 25rem; overflow: hidden">
        <template #title>{{ this.checklist.nombre }}</template>
        <template #content>          
          <div class="field">
            <label for="activa" class="mb-3">Estatus: </label>
            <b>{{ (this.checklist.activa) ? "Si" : "No" }} </b>
          </div>
          <div class="field">
            <label for="items" class="mb-3">Tareas: </label>
            
            <li v-for="(item, index) in this.checklist.items" :key="index">
                {{ item.nombre }}
            </li>
          </div>
        </template>
      </Card>      
    </Dialog>
</template>

<script>
import { sendRequestList, sendRequest, userCan} from '@/helper';    
import { FilterMatchMode } from '@primevue/core/api';

const url = import.meta.env.VITE_APP_BASE_URL;

export default {
    data() {
        return {
            checklists: null,
            loading: false,          
            totalItems: 0,
            checklist: {},
            errorMessage: '',
            submitted: false,
            checklistDialog: false,
            deleteChecklistDialog: false,
            showDialog: false,  
            filters: {            
                name: { value: null, matchMode: FilterMatchMode.CONTAINS },            
            },          
            filterName: "",            
            filterActiva: null,
            params: "",
            task: "",
            tasks: []
        };
    },
    mounted() {
        this.getChecklists();
    },
    methods:{
        addTask() {
            if (this.task.length > 0) {                
                if (this.task.includes('\n')) {                    
                    const lineas = this.task.split('\n');
                    const lineasFiltradas = lineas.filter(linea => linea.trim() !== '');

                    lineasFiltradas.forEach((elemento) => {
                        this.tasks.push({ nombre: elemento, activa: 1 });
                    });
                } else {
                    this.tasks.push({ nombre: this.task, activa: 1 });
                }                                                      
            }
            this.task = "";     
        },
        removeTask(index) {      
            this.tasks.splice(index, 1);
        },
        async getChecklists() {
            this.loading = true;
            this.makeParams();
            const result = await sendRequestList(url+"/checklists?page=1"+this.params);            
            this.checklists = result.data.data;
            this.loading = false;
            this.totalItems = result.data.meta.total;
        },
        makeParams(){
            this.params= "";
            this.params = this.addParam(this.params, "nombre", this.filterName);
            this.params = this.addParam(this.params, "activa", this.filterActiva);
        },
        addParam(params, param="", value=""){
            const valueEndode = encodeURIComponent(value);
            params = (value != null && value !== "")? params+"&"+param+"="+valueEndode : params;
            return params;
        },        
        can(action) {
            return userCan(action);
        },
        async onPage(event) {
            this.loading = true;
            var page = event.page + 1;
            this.makeParams();
            const result = await sendRequestList(url+"/checklists?page="+page+this.params);
            this.checklists = result.data.data;
            this.loading = false;          
        },
        openNew() {            
            this.checklist = {};
            this.submitted = false;
            this.checklistDialog = true;
            this.checklist.activa=true;
            this.tasks = [];
        },
        validateForm() {
            if (this.checklist.nombre != null) {
                this.errorMessage = 'El nombre es requerido'
                return false;
            }                         
            this.errorMessage = '';          
            return true;            
        },
        hideDialog() {
            this.checklistDialog = false;
            this.submitted = false;
        },
        async saveChecklist() {
            this.submitted = true;
            var message = "";
            var result = "";
            if (this.errorMessage === '' && this.checklist.nombre && this.checklist.nombre != '' ) {
                var params = {
                    nombre: this.checklist.nombre.trim(),
                    activa: this.checklist.activa,
                    items: this.tasks                    
                };                
                
                if(this.checklist.id) {
                    message = "Checklist actualizada";
                    result = await sendRequest(
                        "PUT",
                        params,
                        url+"/checklists/"+this.checklist.id
                    ); 
                } else {
                    message = "Checklist registrada";              
                    result = await sendRequest(
                        "POST",
                        params,
                        url+"/checklists",
                    );
                }
                                
                if (result === "ok") {
                    this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});
                    this.checklistDialog = false;  
                    this.checklist = {};
                    this.getChecklists();
                    this.tasks= [];
                    this.task = "";
                } else {
                    this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
                }
            }
        },
        async editChecklist(checklist) {
            const result = await sendRequest('GET', {},url+"/checklists/"+checklist.id, true);
            this.checklist = {...result.data};                        
            this.checklist.activa = (this.checklist.activa == 1) ? true : false;
            this.checklistDialog = true;
            this.tasks = this.checklist.items;
        },
        async showChecklist(checklist) {
            const result = await sendRequest('GET', {},url+"/checklists/"+checklist.id, true);
            this.checklist = {...result.data};
            this.checklist.activa = (this.checklist.activa == 1) ? true : false;
            this.showDialog = true;
        },
        confirmDeleteChecklist(checklist) {
            this.checklist = checklist;
            this.deleteChecklistDialog = true;
        },
        async deleteChecklist() {
            const id = this.checklist.id;
            const result = await sendRequest('DELETE', {id: id},url+"/checklists/"+id);

            if (result === "ok") {
                this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Checklist eliminada', life: 3000});
            } else {
                this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
            }

            this.deleteChecklistDialog = false;
            this.checklist = {};
            this.getChecklists();
        } 
    }
};
</script>
<style>
.p-column-filter-menu-button{
  visibility:hidden;
}
</style>