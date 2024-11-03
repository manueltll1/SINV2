<template>
    <Toast />
    <div class="card">
        <DataView :value="tableros" :layout="layout">            
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="p-input-icon-left">
                    <i class="pi pi-search" />  
                        <InputText id="filterName" v-model="filterName" type="text" @keydown.enter="getTableros()" placeholder="Buscar por nombre" />
                    </span>
                    <div v-if="can('tableros.store')">
                        <Button label="Nuevo" icon="pi pi-plus" severity="success" @click="openNew" />
                    </div>                    
                </div>
            </template>
            <template #empty> Tableros no encontrados. </template>
            <template #loading> cargando datos de tableros. Por favor espere. </template>
            <template #grid="slotProps">
                <div class="grid grid-nogutter">
                    <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                        <div v-if="item.activo==1" class="p-4 border-1 card border-round border-primary">                            
                            <div class="flex flex-column align-items-center gap-3 py-5">
                                <div class="text-xl font-bold">
                                    <router-link :to="{ name: 'tablero', params: { id: item.id }}">{{ item.nombre }}</router-link>
                                </div>
                            </div>
                            <div class="flex flex-wrap align-items-center justify-content-between gap-3" >
                                <Button v-if="can('tablerosusuario.store')" icon="pi pi-user" outlined rounded   @click="formUsers(item)" />
                                <Button v-if="can('tableros.update')" icon="pi pi-pencil" outlined rounded severity="success"  @click="editTablero(item)" />
                                <div></div>
                            </div>
                        </div>
                        <div v-if="item.activo==0" class="p-4 border-1 card border-round surface-border">
                            <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                                <div class="flex align-items-center gap-2">
                                    <i class="pi pi-tag"></i>
                                    <span class="font-semibold">{{ item.tipo }}</span>
                                </div>                                
                            </div>
                            <div class="flex flex-column align-items-center gap-3 py-5">                                
                                <div class="text-xl font-bold">{{ item.nombre }}</div>                                
                            </div>
                            <div class="flex flex-wrap align-items-center justify-content-between gap-2" >                                
                                <Button v-if="can('tableros.update')" icon="pi pi-pencil" outlined rounded severity="success"  @click="editTablero(item)" />
                                <Button v-if="can('tableros.destroy')" icon="pi pi-trash"  outlined rounded severity="danger"  @click="confirmDelete(item)" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
        <Paginator :rows="9" :totalRecords="totalItems" @page="onPage($event)"></Paginator>
    </div>    
    <Dialog v-model:visible="tableroDialog" :style="{width: '450px'}" header="Tablero" :modal="true" class="p-fluid">
        <div class="field">
          <label for="nombre">Nombre</label>
          <InputText id="nombre" v-model.trim="tablero.nombre" maxlength="50" required="true" :class="{'p-invalid': submitted && !tablero.nombre}" />
          <small class="p-error" v-if="submitted && !tablero.nombre">El nombre es requerido.</small>
        </div>
        <div class="field">            
          <label for="categoria" class="mb-3">Categoría</label>
          <MultiSelect 
            v-model="tablero.categorias" 
            :options="categorias" 
            optionLabel="nombre"
            optionValue="id" 
            :maxSelectedLabels="3"
          />
          <small class="p-error" v-if="submitted && !tablero.categorias">Seleccione al menos una categoría.</small>
        </div>
        <div class="field">            
            <Checkbox v-model="tablero.activo" :binary="true" />
            <label class="ml-2"> Activo </label>
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
            <Button label="Guardar" icon="pi pi-check" text @click="saveTablero" />
        </template>      
    </Dialog>
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="tablero">Realmente desea eliminar el tablero <b>{{tablero.nombre}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteDialog = false"/>
            <Button label="Si" icon="pi pi-check" text @click="deleteTablero" />
        </template>
    </Dialog>
    <Dialog v-model:visible="usersDialog" :style="{width: '450px'}"  :modal="true" class="p-fluid">
        <div class="field">
            <label for="users_ids" class="mb-3">Usuarios</label>        
            <MultiSelect v-model="tableros_usuarios.users_ids" :options="users" filter optionLabel="name" optionValue="id" placeholder="seleccione un usuario" class="w-full md:w-20rem" required="true"/>
            <small class="p-error" v-if="submitted && !tableros_usuarios.users_ids"> Debe seleccionar al menos un usuario.</small>
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideUserDialog"/>
            <Button label="Guardar" icon="pi pi-check" text @click="saveTableroUser" />
        </template>
    </Dialog>
</template>

<script>
import { sendRequestList, sendRequest, userCan} from '@/helper'; 
const url = import.meta.env.VITE_APP_BASE_URL;

export default {
    data() {
        return {            
            tableros: null,
            users: null,
            tableros_usuarios: {},
            tablero: {},
            totalItems: 0,
            layout: 'grid',
            params: "",
            filterName: "",            
            submitted: false,
            tableroDialog: false,            
            deleteDialog: false,
            usersDialog: false,
            categorias: null,
            ramos: null,
            subramos: null
        };
    },
    mounted() {        
        this.getTableros();        
    },
    methods: {        
        async getTableros(){          
          this.loading = true;
          this.makeParams();
          const result = await sendRequestList(url+"/tableros?page=1"+this.params);
          this.tableros = result.data.data;
          this.loading = false;
          this.totalItems = result.data.meta.total;                    
        },        
        async getUsers(){
            this.loading = true;
            const result = await sendRequestList(url+"/users?options=usersbyroles&roles=2,3,4");
            this.users = result.data.data;
        },
        async getUsersTablero(tablero_id){
            this.loading = true;
            const result = await sendRequestList(url+"/usuariostablero/"+tablero_id);
            this.tableros_usuarios.users_ids = result.data;            
        },
        async editTablero(tablero) {
            this.getCategorias();
            const result = await sendRequest('GET', {},url+"/tableros/"+tablero.id, true);
            this.tablero = {...result.data};            
            this.tableroDialog = true;
            this.tablero.categoria_nombre = this.tablero.nombres_categorias;

            const result_ramos = await sendRequestList(url+"/ramosselect?nombre="+this.tablero.categoria_nombre);
            this.ramos = result_ramos.data.data;

            const result_subramo = await sendRequestList(url+"/subramosselect?ramo="+this.tablero.ramo_id+"&nombre="+this.tablero.categoria_nombre);
            this.subramos = result_subramo.data.data;

        },
        async onPage(event) {
          this.loading = true;
          var page = event.page + 1;          
          const result = await sendRequestList(url+"/tableros?page="+page+this.params);
          this.tableros = result.data.data;
          this.loading = false;          
        },
        makeParams(){          
          this.params= "";          
          this.params = this.addParam(this.params, "nombre", this.filterName);                  
        },
        addParam(params, param="", value=""){
          const valueEndode = encodeURIComponent(value);          
          params = (value != null && value != "")? params+"&"+param+"="+valueEndode : params;
          return params;
        },
        openNew() {
          this.tablero = {};
          this.submitted = false;
          this.tableroDialog = true;
          this.getCategorias();
        },
        formUsers(tablero) {
            this.tablero = tablero;
            this.usersDialog = true;
            this.getUsers();
            this.submitted = false;
            this.getUsersTablero(tablero.id);
        },        
        async saveTablero() {
            this.submitted = true;
            var message = "";
            var result = "";
            var activo = 0;            
            if (this.tablero.nombre && this.tablero.nombre != '' && this.tablero.categorias) {
                if(this.tablero.activo) {
                    activo = this.tablero.activo;
                }
                
                var params = {
                    nombre: this.tablero.nombre.trim(),                    
                    activo: activo,
                    categorias: this.tablero.categorias
                };
                if(this.tablero.id) {
                    message = "Tablero actualizado";
                    result = await sendRequest(
                        "PUT",
                        params,
                        url+"/tableros/"+this.tablero.id
                    ); 
                } else {
                    message = "Tablero registrado";              
                    result = await sendRequest(
                        "POST",
                        params,
                        url+"/tableros",
                    );
                }
                if (result === "ok") {
                    this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});
                    this.tableroDialog = false;  
                    this.tablero = {};
                    this.getTableros();
                    this.submitted = false;
                } else {
                    this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
                }   
            }                             
        },
        async saveTableroUser() {
            this.submitted = true;
            var result = "";
            if (this.tablero.id != '' && this.tableros_usuarios.users_ids) {
                var params = {
                    tablero_id: this.tablero.id,
                    users: this.tableros_usuarios.users_ids
                };            

                result = await sendRequest(
                    "POST",
                    params,
                    url+"/tablerosusuarios",
                );

                if (result === "ok") {
                    this.$toast.add({severity:'success', summary: 'Éxito', detail: "Usuarios registrados", life: 3000});
                    this.usersDialog = false;  
                    this.tableros_usuarios = {};
                    this.submitted = false;                    
                } else {
                    this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
                }
            }            
        },
        async deleteTablero() {
          const id = this.tablero.id;
          const result = await sendRequest('DELETE', {id: id},url+"/tableros/"+id); 
          if (result === "ok") {
            this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Tablero eliminado', life: 3000});
          } else {
            this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
          }
          this.deleteDialog = false;
          this.tablero = {};
          this.getTableros();
        },        
        confirmDelete(tablero) {
            this.tablero = tablero;
            this.deleteDialog = true;
        },
        
        hideDialog() {
          this.tableroDialog = false;
          this.submitted = false;
        },
        hideUserDialog() {
            this.usersDialog = false;
            this.tableros_usuarios = {};
            this.submitted = false;
        },
        async getCategorias() {
            const result = await sendRequestList(url+"/categoriaselect");
            this.categorias = result.data;
        },
        can(action) {
          return userCan(action);
        },        
        
    }
};
</script>
<style>
.right {
  position: absolute;
  right: 50px;
}
</style>