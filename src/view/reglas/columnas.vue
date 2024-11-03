<template>
    <Toast />     
    <div class="card">
        <div v-if="can('reglas.columnas.store')">
          <Toolbar class="mb-4">
            <template #end>
              <Button label="Nueva" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
              <Button label="Eliminar" icon="pi pi-minus" severity="danger" class="mr-2" @click="confirmDeleteSelected" />
            </template>          
          </Toolbar>
        </div>
        <DataTable v-model:filters="filters" :value="columns" dataKey="id" v-model:selection="multiple"
          filterDisplay="row" stripedRows showGridlines :rows="20" scrollable scrollHeight="600px">
            <template #empty>  No existen registros. </template>
            <template #loading> cargando datos de reglas. Por favor espere. </template>
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="tablero" header="Tablero" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.tablero }}
              </template>
              <template #filter>
                <InputText id="filterTablero" v-model="filterTablero" type="text" @keydown.enter="getColumnas()" placeholder="Buscar por tablero" />
              </template>
            </Column>
            <Column field="columna" header="Columna" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.columna }}
              </template>
              <template #filter>
                <InputText id="filterColumna" v-model="filterColumna" type="text" @keydown.enter="getColumnas()" placeholder="Buscar por columna" />
              </template>
            </Column>
            <Column field="checklist" header="Checklist" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.checklist }}
              </template>
              <template #filter>
                <InputText id="filterChecklist" v-model="filterChecklist" type="text" @keydown.enter="getColumnas()" placeholder="Buscar por checklist" />
              </template>
            </Column>
            <Column field="categoria" header="Categoría" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.categoria }}
              </template>
              <template #filter>
                <InputText id="filterCategoria" v-model="filterCategoria" type="text" @keydown.enter="getColumnas()" placeholder="Buscar por categoría" />
              </template>
            </Column>
            <Column field="subramo" header="Subramo" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.subramo }}
              </template>
              <template #filter>
                <InputText id="filterSubramo" v-model="filterSubramo" type="text" @keydown.enter="getColumnas()" placeholder="Buscar por subramo" />
              </template>
            </Column>
            <Column :exportable="false" header="Opciones" style="min-width:8rem">
              <template #body="slotProps">
                <Button v-if="can('reglas.columnas.show')" icon="pi pi-eye" outlined rounded @click="show(slotProps.data)" />
                <Button v-if="can('reglas.columnas.delete')" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDelete(slotProps.data)" /> 
              </template>
            </Column> 
        </DataTable>
        <Paginator :rows="10" :totalRecords="totalItems" @page="onPage($event)"></Paginator>
    </div>
    <Dialog v-model:visible="formDialog" :style="{width: '450px'}" header="" :modal="true" class="p-fluid" position="top">
      <div class="field">
        <label for="columna" class="mb-3">Tablero/Columna</label>
        <TreeSelect v-model="model.columna" :options="nodes" placeholder="Seleccione una columna" class="md:w-20rem w-full" parent />
        <small class="p-error" v-if="submitted && !model.columna">La columna es requerida.</small>
      </div>
      <div class="field">
        <label for="checklist" class="mb-3">Checklists</label>
        <MultiSelect v-model="model.checklist" :options="checklists" filter optionLabel="nombre" optionValue="id" placeholder="Seleccione" class="w-full md:w-20rem" />
        <small class="p-error" v-if="submitted && !model.checklist">Seleccione al menos un checklist.</small>
      </div>      
      <div class="field">            
        <label for="categoria" class="mb-3">Categoría</label>
        <MultiSelect 
          v-model="model.categoria_id" 
          :options="categorias" 
          optionLabel="nombre"
          optionValue="id" 
          :maxSelectedLabels="3"
          class="w-full md:w-20rem"
        />
      </div>
      <div class="field">            
        <label for="ramo" class="mb-3">Ramo</label>
        <MultiSelect 
          v-model="model.ramo_id" 
          :options="ramos" 
          optionLabel="nombre"
          optionValue="id" 
          :maxSelectedLabels="3"
          class="w-full md:w-20rem"
          @change="getSubramos"
        />
      </div>
      <div class="field">            
        <label for="ramo" class="mb-3">Subramo</label>
        <MultiSelect 
          v-model="model.subramo_id" 
          :options="subramos" 
          optionLabel="nombre"
          optionValue="id" 
          :maxSelectedLabels="3"
          class="w-full md:w-20rem"
        />
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="Guardar" icon="pi pi-check" text @click="save" />
      </template>
      
    </Dialog>
    <Dialog v-model:visible="showDialog" style="width: 33rem"  :modal="true" position="top">
      <Card style="width: 30rem; overflow: hidden">
        <template #title>Tableo/Columna: {{ this.reglas.tablero }} / {{ this.reglas.columna }} </template>
        <template #content>                    
          <div class="field">
            <label for="items" class="mb-3">Checklist: {{ this.reglas.checklist }}</label>
          </div>
          <div class="field">
            <label for="items" class="mb-3">Categorias: {{ this.reglas.categoria }} </label>
          </div>
          <div class="field">
            <label for="items" class="mb-3">Subramo: {{ this.reglas.subramo }} </label>
          </div>
          <div class="field">
            <label for="items" class="mb-3">Ramo: {{ this.reglas.ramo }} </label>
          </div>
        </template>
      </Card>      
    </Dialog>
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="model">Realmente desea eliminar la regla?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteDialog = false"/>
            <Button label="Si" icon="pi pi-check" text @click="destroy" />
        </template>
    </Dialog>
    <Dialog v-model:visible="deleteSelectedDialog" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="model">Realmente desea eliminar las reglas?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteSelectedDialog = false"/>
            <Button label="Si" icon="pi pi-check" text @click="destroySelected" />
        </template>
    </Dialog>
</template>

<script>

import { sendRequestList, userCan, sendRequest} from '@/helper';
import { FilterMatchMode } from '@primevue/core/api';

const url = import.meta.env.VITE_APP_BASE_URL;
export default {
  data() {
    return {
      nodes: null,
      checklists: null,
      selectedValue: null,
      checklist: null,
      categorias: null,
      filters: {            
          name: { value: null, matchMode: FilterMatchMode.CONTAINS },            
      },
      columns: null,
      loading: false,          
      totalItems: 0,
      filterTablero: "",
      filterColumna: "",
      filterChecklist: "",
      filterCategoria: "",
      filterSubramo: "",
      params: "",
      formDialog: false,
      showDialog: false, 
      submitted: false,
      model: {},
      showchecklists: [],
      showcategorias: [],
      showcolumna: "",
      reglas: null,
      deleteDialog: false,
      ramos: null,
      subramos: null,
      page: 0,
      multiple: [],
      deleteSelectedDialog: false
    }
  },
  methods: {
    can(action) {
      return userCan(action);
    },
    async getTablerosColumnas() {
      const result = await sendRequestList(url+"/listtableroscolumnas");
      this.nodes = result.data.data;
    },
    async getCheckLists() {
      const result = await sendRequestList(url+"/checklist");
      this.checklists = result.data.data;
    },
    async getCategorias() {
      const result = await sendRequestList(url+"/categoriaselect");
      this.categorias = result.data;
    },
    async getRamos() {
      const result = await sendRequestList(url+"/ramosselect");
      this.ramos = result.data.data;
    },
    async getSubramos() {
      this.model.subramo_id = null;
      const result = await sendRequestList(url+"/subramosselect?ramo="+this.model.ramo_id);
      this.subramos = result.data.data;
    },
    async getColumnas() {
      this.loading = true;
      this.makeParams();
      const result = await sendRequestList(url+"/indexreglacolumna?page="+this.page+this.params);
      this.columns = result.data.data;
      this.loading = false;
      this.totalItems = result.data.meta.total; 
    },

    makeParams(){          
      this.params= "";          
      this.params = this.addParam(this.params, "columna", this.filterColumna);
      this.params = this.addParam(this.params, "tablero", this.filterTablero);
      this.params = this.addParam(this.params, "checklist", this.filterChecklist);
      this.params = this.addParam(this.params, "categoria", this.filterCategoria);
      this.params = this.addParam(this.params, "subramo", this.filterSubramo);
    },
    addParam(params, param="", value=""){
      const valueEndode = encodeURIComponent(value);          
      params = (value != null && value !== "")? params+"&"+param+"="+valueEndode : params;
      return params;
    }, 
    async onPage(event) {
      this.loading = true;
      this.page = event.page + 1;
      this.makeParams();
      const result = await sendRequestList(url+"/indexreglacolumna?page="+this.page+this.params);
      this.columns = result.data.data;
      this.loading = false;          
    },
    openNew() {
      this.getTablerosColumnas();
      this.getCheckLists();
      this.getCategorias();
      this.getRamos();
      this.model = {};
      this.submitted = false;
      this.formDialog = true;
    },
    hideDialog() {
      this.submitted = false;
      this.formDialog = false;
    },
    async save() {        
      this.submitted = true;
      var message = "";
      var result = "";
      if(this.model.columna && this.model.checklist) {
        var params = {
          columna: Object.keys(this.model.columna),
          checklists: this.model.checklist,
          categorias: this.model.categoria_id,
          subramos: this.model.subramo_id
        };        

        
        message = "Regla registrada";
        result = await sendRequest(
          "POST",
          params,
          url+"/storereglacolumna"
        );
              
        if (result === "ok") {
          this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});
          this.formDialog = false;  
          this.model = {};
          this.getColumnas();
        } else {
          this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
        }          
      }
    },
    async show(data) {
      await this.getReglas(data.id);
      this.showDialog = true;
    },
    async getReglas(columna_id) {
      const result = await sendRequestList(url+"/showreglacolumna/"+columna_id);
      this.reglas = result.data.data;
    },
    confirmDelete(data) {
      this.model.id = data.id;
      this.deleteDialog = true;
    },
    async destroy() {
      const id = this.model.id;
      const result = await sendRequest('DELETE', {id: id},url+"/reglacolumna/"+id);
      
      if (result === "ok") {
        this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Regla eliminadas', life: 3000});
      } else {
        this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
      }
      this.model = {};
      this.deleteDialog = false;
      this.getColumnas();
    },
    confirmDeleteSelected() {      
      this.deleteSelectedDialog = true;
    },
    async destroySelected() {
      if (this.multiple.length > 0) {        
        const ids = this.multiple.map(objeto => objeto.id);
        const result = await sendRequest('DELETE', {id: ids},url+"/reglascolumna?ids="+ids);

        if (result === "ok") {
          this.getColumnas();
          this.multiple = [];
          this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Reglas eliminadas', life: 3000});
        } else {
          this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
        }        
      }
      this.deleteSelectedDialog = false;
    }

  },
  mounted() {
      this.getColumnas();
  }
}
</script>
<style>
.p-column-filter-menu-button{
  visibility:hidden;
}
</style>