<template>
    <Toast /> 
    <div class="card">
        <div v-if="can('users.store')">
          <Toolbar class="mb-4">
            <template #end>
              <Button label="Nuevo" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />              
            </template>          
          </Toolbar>
        </div>
        <DataTable v-model:filters="filters" :value="users" dataKey="id" 
        filterDisplay="row" stripedRows showGridlines :rows="20" scrollable scrollHeight="600px">
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="text-xl text-900 font-bold">Usuarios</span>                    
                </div>
            </template>
            <template #empty> Usuarios no encontrados. </template>
            <template #loading> cargando datos de usuarios. Por favor espere. </template>
            <Column field="name" header="Nombre" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.name }}
              </template>
              <template #filter>
                <InputText id="filterName" v-model="filterName" type="text" @keydown.enter="getUsers()" placeholder="Buscar por nombre" />
              </template>
            </Column>
            <Column field="username" header="Username">
              <template #body="{ data }">
                {{ data.username }}
              </template>
              <template #filter>
                <InputText id="filterUsername" v-model="filterUsername" type="text" @keydown.enter="getUsers()" placeholder="Buscar por nombre de usuario" />
              </template>
            </Column>
            <Column field="iniciales" header="iniciales">
              <template #body="{ data }">
                {{ data.iniciales }}
              </template>
              <template #filter>
                <InputText id="filterInicial" v-model="filterInicial" type="text" @keydown.enter="getUsers()" placeholder="Buscar por iniciales de usuario" />
              </template>
            </Column>
            <Column field="role" header="Rol">
              <template #body="{ data }">
                {{ data.role }}
              </template>
              <template #filter>
                <!--<InputText id="filterRoles" v-model="filterRoles" type="text" @keydown.enter="getUsers()" placeholder="Buscar por rol" />-->
                <MultiSelect v-model="filterRoles" :options="roles" optionLabel="name" optionValue="id" @change="getUsers()" placeholder="seleccione un rol" class="w-full md:w-20rem"  />
              </template>
            </Column>            
            <Column :exportable="false" header="Opciones" style="min-width:8rem">
              <template #body="slotProps">                
                <Button v-if="can('users.update')" icon="pi pi-pencil" outlined rounded severity="success" @click="editUser(slotProps.data)" />                                  
                <Button v-if="can('users.destroy')" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" />                
              </template>
            </Column>          
        </DataTable>
        <Paginator :rows="10" :totalRecords="totalItems" @page="onPage($event)"></Paginator>
    </div>
    <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="Usuario" :modal="true" class="p-fluid">
      <div class="field">
          <label for="name">Nombre</label>
          <InputText id="name" v-model.trim="user.name" required="true" :class="{'p-invalid': submitted && !user.name}" />
          <small class="p-error" v-if="submitted && !user.name">El nombre es requerido.</small>
      </div>
      <div class="field">
          <label for="iniciales">Iniciales</label>
          <InputText id="iniciales" v-model.trim="user.iniciales" required="true" :class="{'p-invalid': submitted && !user.iniciales}" />
          <small class="p-error" v-if="submitted && !user.iniciales">La inicial es requerida.</small>
      </div>
      <div class="field">
          <label for="username">Usuario</label>
          <InputText id="username" v-model.trim="user.username" type="email" required="true" :class="{'p-invalid': submitted && !user.username}" @input="validateForm()" />
          <small class="p-error" v-if="submitted && !user.username">El usuario es requerido.</small>
          <small class="p-error" v-if="errorUsername"> {{  errorUsername }}</small>
      </div>
      <div class="field">
          <label for="password">Contraseña</label>          
          <Password id="password" v-model.trim="user.password" :feedback="false" :class="{'p-invalid': submitted && !user.password  && !user.id} " toggleMask @input="validateForm()"/>          
          <small class="p-error" v-if="submitted && !user.password && !user.id">La contraseña es requerida.</small>
          <small class="p-error" v-if="errorPassword"> {{  errorPassword }}</small>
      </div>
      <div class="field">
          <label for="password_confirmation">Repita la contraseña</label>          
          <Password id="password_confirmation" v-model.trim="user.password_confirmation" :feedback="false" toggleMask @input="validateForm()"/>
          <small class="p-error" v-if="submitted && !user.password_confirmation && !user.id">La contraseña es requerida.</small>
          <small class="p-error" v-if="errorMessage"> {{  errorMessage }}</small>          
      </div>     
      <div class="field">
				<label for="role_id" class="mb-3">Rol</label>        
        <MultiSelect v-model="user.role_id" :options="roles" optionLabel="name" optionValue="id" placeholder="seleccione un rol" class="w-full md:w-20rem" />
        <small class="p-error" v-if="submitted && !user.role_id">El rol es requerido.</small>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="Guardar" icon="pi pi-check" text @click="saveUser" />
      </template>
    </Dialog>
    <Dialog v-model:visible="deleteUserDialog" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="user">Realmente desea eliminar el usuario <b>{{user.username}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteUserDialog = false"/>
            <Button label="Si" icon="pi pi-check" text @click="deleteUser" />
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
          users: null,
          loading: false,
          currentPage: 1,
          totalItems: 0,
          user: {},          
          errorMessage: '',
          errorUsername: '',
          errorPassword: '',
          submitted: false,
          userDialog: false,
          roles: null,
          deleteUserDialog: false,          
          filters: {            
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            username: { value: null, matchMode: FilterMatchMode.CONTAINS },
            role_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
          },          
          filterName: "",
          filterUsername: "",
          filterInicial: "",
          filterRoles: "",
          params: ""          
        }
      },
      mounted(){
        this.getUsers();        
        this.getRoles();                
      },
      methods:{
        async getUsers(){          
          this.loading = true;
          this.makeParams();
          const result = await sendRequestList(url+"/users?page=1"+this.params);
          this.users = result.data.data;
          this.loading = false;
          this.totalItems = result.data.meta.total;          
        },
        makeParams(){          
          this.params= "";          
          this.params = this.addParam(this.params, "name", this.filterName);
          this.params = this.addParam(this.params, "username", this.filterUsername);
          this.params = this.addParam(this.params, "iniciales", this.filterInicial);          
          this.params = this.addParam(this.params, "roles", this.filterRoles);          
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
          const result = await sendRequestList(url+"/users?page="+page+this.params);
          this.users = result.data.data;
          this.loading = false;          
        },
        openNew() {
          this.user = {};
          this.submitted = false;
          this.userDialog = true;
        },
        validateForm() {
          var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
          if (!re.test(this.user.username)) {
            this.errorUsername = 'Dirección de email incorrecta';
            return false;
          }

          if (this.user.password !== this.user.password_confirmation) {
              this.errorMessage = 'Las contraseñas no coinciden';
              return false;
          }            

          if (this.user.password != null && this.user.password.length < 8) {
            this.errorPassword = 'Ingrese al menos 8 caracteres'
            return false;
          } 
                        
          this.errorMessage = '';
          this.errorUsername = '';
          this.errorPassword = '';
          return true;            
        },
        hideDialog() {
          this.userDialog = false;
          this.submitted = false;
        },
        async saveUser() {
          this.submitted = true;
          var message = "";
          var result = "";
          if (this.errorMessage === '' && this.errorUsername === '' && this.errorPassword == '' &&
            this.user.name != '' && this.user.username != '' && this.user.role_id != '' && this.user.iniciales != null) {
            var params = {
              name: this.user.name.trim(),
              username: this.user.username.trim(),
              iniciales: this.user.iniciales.trim(),
              role_id: this.user.role_id,
              password: this.user.password,
              password_confirmation: this.user.password_confirmation
            };            

            if(this.user.id) {
              message = "Usuario actualizado";
              result = await sendRequest(
                "PUT",
                params,
                url+"/users/"+this.user.id
              ); 
            } else {
              message = "Usuario registrado";              
              result = await sendRequest(
                "POST",
                params,
                url+"/users",
              );
            }
                                
            if (result === "ok") {
              this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});
              this.userDialog = false;  
              this.user = {};
              this.getUsers();
            } else {
              this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
            }
          }
        },
        async editUser(user) {
            const result = await sendRequest('GET', {},url+"/users/"+user.id, true);
            this.user = {...result.data};            
            this.userDialog = true;
        },
        confirmDeleteUser(user) {
            this.user = user;
            this.deleteUserDialog = true;
        },
        async deleteUser() {
          const id = this.user.id;
          const result = await sendRequest('DELETE', {id: id},url+"/users/"+id); 
          if (result === "ok") {
            this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Usuario eliminado', life: 3000});
          } else {
            this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
          }
          this.deleteUserDialog = false;
          this.user = {};
          this.getUsers();
        }        
      }
    }
  </script>
<style>
.p-input-icon-right > i:last-of-type, .p-input-icon-right > svg:last-of-type {
  right:.5rem;
  color:#bababa;
}
.p-column-filter-menu-button{
  visibility:hidden;
}
</style>