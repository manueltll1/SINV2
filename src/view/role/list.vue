<template>
    <Toast /> 
    <div class="card">
        <div v-if="can('roles.store')">
          <Toolbar class="mb-4">
            <template #end>
              <Button label="Nuevo" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />              
            </template>          
          </Toolbar>
        </div>
        <DataTable v-model:filters="filters" :value="roles" dataKey="id" 
        filterDisplay="row" stripedRows showGridlines :rows="20" scrollable scrollHeight="600px">
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="text-xl text-900 font-bold">Roles</span>                    
                </div>
            </template>
            <template #empty> Roles no encontrados. </template>
            <template #loading> cargando datos de roles. Por favor espere. </template>
            <Column field="name" header="Nombre" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.name }}
              </template>
              <template #filter>
                <InputText id="filterName" v-model="filterName" type="text" @keydown.enter="getRoles()" placeholder="Buscar por nombre" />
              </template>
            </Column>                                 
            <Column :exportable="false" header="Opciones" style="min-width:8rem">
              <template #body="slotProps">                
                <Button v-if="can('roles.update')" icon="pi pi-pencil" outlined rounded severity="success" @click="editRole(slotProps.data)" />                                  
                <Button v-if="can('roles.destroy')" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteRole(slotProps.data)" />                
              </template>
            </Column>          
        </DataTable>
        <Paginator :rows="10" :totalRecords="totalItems" @page="onPage($event)"></Paginator>
    </div>
    <Dialog v-model:visible="roleDialog" :style="{width: '450px'}" header="Role" :modal="true" class="p-fluid">
      <div class="field">
          <label for="name">Nombre</label>
          <InputText id="name" v-model.trim="role.name" required="true" :class="{'p-invalid': submitted && !role.name}" />
          <small class="p-error" v-if="submitted && !role.name">El nombre es requerido.</small>
      </div>
      <div class="field">
				<label for="permissions" class="mb-3">Permisos</label>        
        <MultiSelect v-model="role.permissions" :options="permissions" filter optionLabel="name" optionValue="id" placeholder="seleccione" class="w-full md:w-20rem" />        
      </div>
      
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="Guardar" icon="pi pi-check" text @click="saveRole" />
      </template>
    </Dialog>
    <Dialog v-model:visible="deleteRoleDialog" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="role">Realmente desea eliminar el rol <b>{{role.name}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteRoleDialog = false"/>
            <Button label="Si" icon="pi pi-check" text @click="deleteRole" />
        </template>
    </Dialog>
  </template>
  
  
  <script>    
    import { sendRequestList, sendRequest, userCan} from '@/helper';    
    import { FilterMatchMode } from '@primevue/core/api';

    const url = import.meta.env.VITE_APP_BASE_URL;    
    export default{      
      data(){
        return{
          roles: null,
          permissions: null,
          loading: false,          
          totalItems: 0,
          role: {},          
          errorMessage: '',
          submitted: false,
          roleDialog: false,
          deleteRoleDialog: false,          
          filters: {            
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },            
          },          
          filterName: "",          
          params: ""          
        }
      },
      mounted(){            
        this.getRoles();
        this.getPermissions();
      },
      methods:{
        async getRoles(){          
          this.loading = true;
          this.makeParams();
          const result = await sendRequestList(url+"/roles?page=1"+this.params);
          this.roles = result.data.data;
          this.loading = false;
          this.totalItems = result.data.meta.total;          
        },
        makeParams(){          
          this.params= "";          
          this.params = this.addParam(this.params, "name", this.filterName);                  
        },
        addParam(params, param="", value=""){
          const valueEndode = encodeURIComponent(value);          
          params = (value != null && value != "")? params+"&"+param+"="+valueEndode : params;
          return params;
        },
        async getPermissions(){
            this.loading = true;
            const result = await sendRequestList(url+"/permissionslist");
            this.permissions = result.data;            
        },
        can(action) {
          return userCan(action);
        },
        async onPage(event) {
          this.loading = true;
          var page = event.page + 1;
          this.makeParams();
          const result = await sendRequestList(url+"/roles?page="+page+this.params);
          this.roles = result.data.data;
          this.loading = false;          
        },
        openNew() {
          this.role = {};
          this.submitted = false;
          this.roleDialog = true;
        },
        validateForm() {                     
          if (this.role.name != null) {
            this.errorMessage = 'El nombre es requerido'
            return false;
          } 
                        
          this.errorMessage = '';          
          return true;            
        },
        hideDialog() {
          this.roleDialog = false;
          this.submitted = false;
        },
        async saveRole() {
          this.submitted = true;
          var message = "";
          var result = "";
          if (this.errorMessage === '' && this.role.name != '' ) {
            var params = {
              name: this.role.name.trim(),
              guard_name: "web",
              permissions: this.role.permissions,
            };            

            if(this.role.id) {
              message = "Rol actualizado";
              result = await sendRequest(
                "PUT",
                params,
                url+"/roles/"+this.role.id
              ); 
            } else {
              message = "Rol registrado";              
              result = await sendRequest(
                "POST",
                params,
                url+"/roles",
              );
            }
                                
            if (result === "ok") {
              this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});
              this.roleDialog = false;  
              this.role = {};
              this.getRoles();
            } else {
              this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
            }
          }
        },
        async editRole(role) {
            const result = await sendRequest('GET', {},url+"/roles/"+role.id, true);
            this.role = {...result.data};            
            this.roleDialog = true;            
        },
        confirmDeleteRole(role) {
            this.role = role;
            this.deleteRoleDialog = true;
        },
        async deleteRole() {
          const id = this.role.id;
          const result = await sendRequest('DELETE', {id: id},url+"/roles/"+id); 
          if (result === "ok") {
            this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Rol eliminado', life: 3000});
          } else {
            this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
          }
          this.deleteRoleDialog = false;
          this.role = {};
          this.getRoles();
        }        
      }
    }
  </script>
<style>
.p-column-filter-menu-button{
  visibility:hidden;
}
</style>