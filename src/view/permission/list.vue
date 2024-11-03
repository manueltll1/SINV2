<template>
    <Toast /> 
    <div class="card">
        <div v-if="can('permissions.store')">
          <Toolbar class="mb-4">
            <template #end>
              <Button label="Nuevo" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />              
            </template>          
          </Toolbar>
        </div>
        <DataTable v-model:filters="filters" :value="permissions" dataKey="id" 
        filterDisplay="row" stripedRows showGridlines :rows="20" scrollable scrollHeight="600px">
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="text-xl text-900 font-bold">Permisos</span>                    
                </div>
            </template>
            <template #empty> Permisos no encontrados. </template>
            <template #loading> cargando datos de permisos. Por favor espere. </template>
            <Column field="name" header="Nombre" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.name }}
              </template>
              <template #filter>
                <InputText id="filterName" v-model="filterName" type="text" @keydown.enter="getPermissions()" placeholder="Buscar por nombre" />
              </template>
            </Column>                                 
            <Column :exportable="false" header="Opciones" style="min-width:8rem">
              <template #body="slotProps">                
                <Button v-if="can('permissions.update')" icon="pi pi-pencil" outlined rounded severity="success" @click="editPermission(slotProps.data)" />                                  
                <Button v-if="can('permissions.destroy')" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeletePermission(slotProps.data)" />                
              </template>
            </Column>          
        </DataTable>
        <Paginator :rows="10" :totalRecords="totalItems" @page="onPage($event)"></Paginator>
    </div>
    <Dialog v-model:visible="permissionDialog" :style="{width: '450px'}" header="Permiso" :modal="true" class="p-fluid">
      <div class="field">
          <label for="name">Nombre</label>
          <InputText id="name" v-model.trim="permission.name" required="true" :class="{'p-invalid': submitted && !permission.name}" />
          <small class="p-error" v-if="submitted && !permission.name">El nombre es requerido.</small>
      </div>
      <div class="field">
				<label for="roles" class="mb-3">Roles</label>        
        <MultiSelect v-model="permission.roles" :options="roles" filter optionLabel="name" optionValue="id" placeholder="seleccione" class="w-full md:w-20rem" />        
      </div>
      
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="Guardar" icon="pi pi-check" text @click="savePermission" />
      </template>
    </Dialog>
    <Dialog v-model:visible="deletePermissionDialog" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="permission">Realmente desea eliminar el permiso <b>{{permission.name}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deletePermissionDialog = false"/>
            <Button label="Si" icon="pi pi-check" text @click="deletePermission" />
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
          currentPage: 1,
          totalItems: 0,
          permission: {},          
          errorMessage: '',
          submitted: false,
          permissionDialog: false,
          deletePermissionDialog: false,          
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
        async getPermissions(){          
          this.loading = true;
          this.makeParams();
          const result = await sendRequestList(url+"/permissions?page=1"+this.params);
          this.permissions = result.data.data;
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
        async getRoles(){
            this.loading = true;
            const result = await sendRequestList(url+"/roleslist");
            this.roles = result.data;            
        },
        can(action) {
          return userCan(action);
        },
        async onPage(event) {
          this.loading = true;
          var page = event.page + 1;
          this.makeParams();
          const result = await sendRequestList(url+"/permissions?page="+page+this.params);
          this.permissions = result.data.data;
          this.loading = false;          
        },
        openNew() {
          this.permission = {};
          this.submitted = false;
          this.permissionDialog = true;
        },
        validateForm() {                     
          if (this.permission.name != null) {
            this.errorMessage = 'El nombre es requerido'
            return false;
          } 
                        
          this.errorMessage = '';          
          return true;            
        },
        hideDialog() {
          this.permissionDialog = false;
          this.submitted = false;
        },
        async savePermission() {
          this.submitted = true;
          var message = "";
          var result = "";
          if (this.errorMessage === '' && this.permission.name != '' ) {
            var params = {
              name: this.permission.name.trim(),
              guard_name: "web",
              roles: this.permission.roles,
            };            

            if(this.permission.id) {
              message = "Permiso actualizado";
              result = await sendRequest(
                "PUT",
                params,
                url+"/permissions/"+this.permission.id
              ); 
            } else {
              message = "Permiso registrado";              
              result = await sendRequest(
                "POST",
                params,
                url+"/permissions",
              );
            }
                                
            if (result === "ok") {
              this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});
              this.permissionDialog = false;  
              this.permission = {};
              this.getPermissions();
            } else {
              this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
            }
          }
        },
        async editPermission(permission) {
            const result = await sendRequest('GET', {},url+"/permissions/"+permission.id, true);
            this.permission = {...result.data};            
            this.permissionDialog = true;            
        },
        confirmDeletePermission(permission) {
            this.permission = permission;
            this.deletePermissionDialog = true;
        },
        async deletePermission() {
          const id = this.permission.id;
          const result = await sendRequest('DELETE', {id: id},url+"/permissions/"+id); 
          if (result === "ok") {
            this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Permiso eliminado', life: 3000});
          } else {
            this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
          }
          this.deletePermissionDialog = false;
          this.permission = {};
          this.getPermissions();
        }        
      }
    }
  </script>
<style>
.p-column-filter-menu-button{
  visibility:hidden;
}
</style>