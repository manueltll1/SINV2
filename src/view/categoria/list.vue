<template>
    <Toast /> 
    <div class="card">
        <div v-if="can('categorias.store')">
          <Toolbar class="mb-4">
            <template #end>
              <Button label="Nueva" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />              
            </template>          
          </Toolbar>
        </div>
        <DataTable v-model:filters="filters" :value="categorias" dataKey="id" 
        filterDisplay="row" stripedRows showGridlines :rows="20" scrollable scrollHeight="600px">
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="text-xl text-900 font-bold">Categorías</span>                    
                </div>
            </template>
            <template #empty> Categorías no encontrados. </template>
            <template #loading> cargando datos de categorías. Por favor espere. </template>
            <Column field="nombre" header="Nombre" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.nombre }}
              </template>
              <template #filter>
                <InputText id="filterName" v-model="filterName" type="text" @keydown.enter="getCategorias()" placeholder="Buscar por nombre" />
              </template>
            </Column>                        
            <Column field="activa" header="activa" style="min-width: 12rem">
              <template #body="{ data }">
                  <i class="pi" :class="{ 'pi-check-circle text-green-500': data.activa, 'pi-times-circle text-red-400': !data.activa }"></i>
              </template>
              <template #filter>
                  <TriStateCheckbox v-model="filterActiva" @change="getCategorias()" />
              </template>
            </Column>
            <Column :exportable="false" header="Opciones" style="min-width:8rem">
              <template #body="slotProps">
                <Button v-if="can('categorias.show')" icon="pi pi-eye" outlined rounded @click="showCategoria(slotProps.data)" />
                <Button v-if="can('categorias.update')" icon="pi pi-pencil" outlined rounded severity="success" @click="editCategoria(slotProps.data)" />                                  
                <Button v-if="can('categorias.destroy')" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCategoria(slotProps.data)" />                
              </template>
            </Column>          
        </DataTable>
        <Paginator :rows="10" :totalRecords="totalItems" @page="onPage($event)"></Paginator>
    </div>
    <Dialog v-model:visible="categoriaDialog" :style="{width: '450px'}" header="Categoría" :modal="true" class="p-fluid">     
      <div class="field">
        <label for="nombre" class="mb-3">Nombre</label><br />
        <InputText id="nombre" v-model.trim="categoria.nombre" maxlength="200" required="true" class="w-full md:w-20rem"/>
        <small class="p-error" v-if="submitted && !categoria.nombre">El nombre es requerido.</small>
      </div>
      <div class="field">
        <label for="tiempo_respuesta">Tiempo de respuesta</label>          
        <InputNumber  id="tiempo_respuesta" v-model="categoria.tiempo_respuesta" mode="decimal" :integerOnly="true" placeholder="Ingrese un número entero" class="w-full md:w-20rem"/>
        <small class="p-error" v-if="submitted && categoria.unidad_tiempo && !categoria.tiempo_respuesta">El tiempo de respuesta es requerido.</small>
      </div>
      <div class="field">
        <label for="unidad_tiempo" class="mb-3">Unidad de tiempo</label>        
        <Dropdown v-model="categoria.unidad_tiempo" :options="unidadestiempo" optionLabel="name" optionValue="id" placeholder="seleccione una unidad de tiempo" class="w-full md:w-20rem" />        
        <small class="p-error" v-if="submitted && categoria.tiempo_respuesta && !categoria.unidad_tiempo">La unidad de tiempo es requerida.</small>
      </div>
      <div class="field">            
          <Checkbox v-model="categoria.activa" :binary="true" />
          <label class="ml-2"> Activa </label>
      </div>
      
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="Guardar" icon="pi pi-check" text @click="saveCategoria" />
      </template>
    </Dialog>
    <Dialog v-model:visible="deleteCategoriaDialog" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="categoria">Realmente desea eliminar la categoría <b>{{categoria.nombre}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteCategoriaDialog = false"/>
            <Button label="Si" icon="pi pi-check" text @click="deleteCategoria" />
        </template>
    </Dialog>
    <Dialog v-model:visible="showDialog" style="width: 28rem"  :modal="true">
      <Card style="width: 25rem; overflow: hidden">
        <template #title>{{ this.categoria.nombre }}</template>
        <template #content>
          <div class="field">
            <label for="tiempo_respuesta" class="mb-3">Tiempo de respuesta: </label>
            <b> {{ this.categoria.tiempo_respuesta }} </b>
          </div>
          <div class="field">
            <label for="unidad_tiempo" class="mb-3">Unidad de tiempo: </label>
            <b>{{ this.categoria.unidad_tiempo }} </b>
          </div>
          <div class="field">
            <label for="activa" class="mb-3">Activa: </label>
            <b>{{ (this.categoria.activa) ? "Si" : "No" }} </b>
          </div>
        </template>
      </Card>      
    </Dialog>
  </template>
  
  
  <script>    
    import { sendRequestList, sendRequest, userCan} from '@/helper';    
    import { FilterMatchMode } from '@primevue/core/api';

    const url = import.meta.env.VITE_APP_BASE_URL;    
    export default{      
      data(){
        return{
          categorias: null,          
          loading: false,          
          totalItems: 0,
          categoria: {},          
          errorMessage: '',
          submitted: false,
          categoriaDialog: false,
          deleteCategoriaDialog: false,
          showDialog: false,  
          filters: {            
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },            
          },          
          filterName: "",          
          filterActiva: null,
          params: "",
          unidadestiempo: null,
          tipos: null,
          page: 0
        }
      },
      mounted(){            
        this.getCategorias();
      },
      methods:{
        async getUnidadesTiempo(){
          this.loading = true;
          const result = await sendRequestList(url+"/unidadestiempo");
          this.unidadestiempo = result.data;
        },
        async getCategorias(){          
          this.loading = true;
          this.makeParams();          
          const result = await sendRequestList(url+"/categorias?page="+this.page+this.params);
          this.categorias = result.data.data;
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
          this.page = event.page + 1;
          this.makeParams();
          const result = await sendRequestList(url+"/categorias?page="+this.page+this.params);
          this.categorias = result.data.data;
          this.loading = false;          
        },
        openNew() {
          this.getUnidadesTiempo();
          this.categoria = {};
          this.submitted = false;
          this.categoriaDialog = true;
          this.categoria.activa=true;
        },
        validateForm() {                     
          if (this.categoria.nombre != null) {
            this.errorMessage = 'El nombre es requerido'
            return false;
          } 
                        
          this.errorMessage = '';          
          return true;            
        },
        hideDialog() {
          this.categoriaDialog = false;
          this.submitted = false;
        },
        async saveCategoria() {
          this.submitted = true;
          var message = "";
          var result = "";
          if (this.errorMessage === '' && this.categoria.nombre && this.categoria.nombre != '' ) {          
            var params = {
              nombre: this.categoria.nombre.trim(),
              tiempo_respuesta: this.categoria.tiempo_respuesta,
              unidad_tiempo: this.categoria.unidad_tiempo,
              activa: this.categoria.activa
            };

            if(this.categoria.id) {
              message = "Categoría actualizada";
              result = await sendRequest(
                "PUT",
                params,
                url+"/categorias/"+this.categoria.id
              ); 
            } else {
              message = "Categoría registrada";              
              result = await sendRequest(
                "POST",
                params,
                url+"/categorias",
              );
            }
                                
            if (result === "ok") {
              this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});
              this.categoriaDialog = false;  
              this.categoria = {};
              this.getCategorias();
            } else {
              this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
            }
          }
        },
        async editCategoria(categoria) {            
            const result = await sendRequest('GET', {},url+"/categorias/"+categoria.id, true);
            this.categoria = {...result.data};                        
            this.categoria.activa = (this.categoria.activa == 1) ? true : false;
            this.categoriaDialog = true;
            this.getUnidadesTiempo();
        },
        async showCategoria(categoria) {
          const result = await sendRequest('GET', {},url+"/categorias/"+categoria.id, true);
          this.categoria = {...result.data};                      
          this.categoria.activa = (this.categoria.activa == 1) ? true : false;
          this.showDialog = true;
        },
        confirmDeleteCategoria(categoria) {
            this.categoria = categoria;
            this.deleteCategoriaDialog = true;
        },
        async deleteCategoria() {
          const id = this.categoria.id;
          const result = await sendRequest('DELETE', {id: id},url+"/categorias/"+id); 
          if (result === "ok") {
            this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Categoría eliminada', life: 3000});
          } else {
            this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
          }
          this.deleteCategoriaDialog = false;
          this.categoria = {};
          this.getCategorias();
        }        
      }
    }
  </script>
<style>
.p-column-filter-menu-button{
  visibility:hidden;
}
</style>