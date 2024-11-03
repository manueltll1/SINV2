<template>
    <Toast /> 
    <div class="card">
        <div v-if="can('prospectos.store')">
          <Toolbar class="mb-4">
            <template #end>
              <Button label="Nuevo" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />              
            </template>          
          </Toolbar>
        </div>
        <DataTable v-model:filters="filters" :value="prospectos" dataKey="id" 
        filterDisplay="row" stripedRows showGridlines :rows="20" scrollable scrollHeight="600px">
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="text-xl text-900 font-bold">Prospectos</span>                    
                </div>
            </template>
            <template #empty> Prospectos no encontrados. </template>
            <template #loading> cargando datos de prospectos. Por favor espere. </template>
            <Column field="nombres" header="Nombres" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.nombres }}
              </template>
              <template #filter>
                <InputText id="filterName" v-model="filterName" type="text" @keydown.enter="getProspectos()" placeholder="Buscar por nombre" />
              </template>
            </Column>
            <Column field="observaciones" header="Observacione" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.observaciones }}
              </template>
              <template #filter>
                <InputText id="filterObservaciones" v-model="filterObservaciones" type="text" @keydown.enter="getProspectos()" placeholder="Buscar por observaciones" />
              </template>
            </Column>
            
            <Column :exportable="false" header="Opciones" style="min-width:8rem">
              <template #body="slotProps">
                <Button v-if="can('prospectos.show')" icon="pi pi-eye" outlined rounded @click="showProspecto(slotProps.data)" />
                <Button v-if="can('prospectos.update')" icon="pi pi-pencil" outlined rounded severity="success" @click="editProspecto(slotProps.data)" />                                  
                <Button v-if="can('prospectos.destroy')" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProspecto(slotProps.data)" />                
              </template>
            </Column>          
        </DataTable>
        <Paginator :rows="10" :totalRecords="totalItems" @page="onPage($event)"></Paginator>
    </div>
    <Dialog v-model:visible="prospectoDialog" :style="{width: '450px'}" header="Prospecto" :modal="true" class="p-fluid">
      <div class="field">
          <label for="nombres">Nombres</label>
          <InputText id="nombres" v-model.trim="prospecto.nombres" />
      </div>
      <div class="field">
          <label for="observaciones">Observaciones</label>
          <Textarea id="observaciones" v-model.trim="prospecto.observaciones" rows="5" />          
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="Guardar" icon="pi pi-check" text @click="saveProspecto" />
      </template>
    </Dialog>
    <Dialog v-model:visible="deleteProspectoDialog" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="prospecto">Realmente desea eliminar el prospecto <b>{{prospecto.nombres}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteProspectoDialog = false"/>
            <Button label="Si" icon="pi pi-check" text @click="deleteProspecto" />
        </template>
    </Dialog>
    <Dialog v-model:visible="showDialog" style="width: 28rem"  :modal="true">
      <Card style="width: 25rem; overflow: hidden">
        <template #title>{{ this.prospecto.nombres }}</template>
        <template #content>
          <div class="field">
            <label for="observaciones" class="mb-3">Observaciones: </label>
            <b> {{ this.prospecto.observaciones }} </b>
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
          prospectos: null,          
          loading: false,          
          totalItems: 0,
          prospecto: {},          
          errorMessage: '',
          submitted: false,
          prospectoDialog: false,
          deleteProspectoDialog: false,
          showDialog: false,  
          filters: {            
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
          },
          filterName: "",
          filterObservaciones: "",
          params: "",
        }
      },
      mounted(){            
        this.getProspectos();
      },
      methods:{        
        async getProspectos(){          
          this.loading = true;
          this.makeParams();          
          const result = await sendRequestList(url+"/prospectos?page=1"+this.params);
          this.prospectos = result.data.data;
          this.loading = false;
          this.totalItems = result.data.meta.total;          
        },
        makeParams(){          
          this.params= "";          
          this.params = this.addParam(this.params, "nombres", this.filterName);
          this.params = this.addParam(this.params, "observaciones", this.filterObservaciones);          
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
          const result = await sendRequestList(url+"/prospectos?page="+page+this.params);
          this.prospectos = result.data.data;
          this.loading = false;          
        },
        openNew() {          
          this.prospecto = {};
          this.submitted = false;
          this.prospectoDialog = true;          
        },        
        hideDialog() {
          this.prospectoDialog = false;
          this.submitted = false;
        },
        async saveProspecto() {
          this.submitted = true;
          var message = "";
          var result = "";
          if (this.errorMessage === '' && (this.prospecto.nombres || this.prospecto.observaciones)  ) {          
            var params = {
              nombres: this.prospecto.nombres.trim(),
              observaciones: this.prospecto.observaciones.trim(),
            };            

            if(this.prospecto.id) {
              message = "Prospecto actualizado";
              result = await sendRequest(
                "PUT",
                params,
                url+"/prospectos/"+this.prospecto.id
              ); 
            } else {
              message = "Prospecto registrado";              
              result = await sendRequest(
                "POST",
                params,
                url+"/prospectos",
              );
            }
                                
            if (result === "ok") {
              this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});
              this.prospectoDialog = false;  
              this.prospecto = {};
              this.getProspectos();
            } else {
              this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
            }
          }
        },
        async editProspecto(prospecto) {            
            const result = await sendRequest('GET', {},url+"/prospectos/"+prospecto.id, true);
            this.prospecto = {...result.data};
            this.prospectoDialog = true;
        },
        async showProspecto(prospecto) {
          const result = await sendRequest('GET', {},url+"/prospectos/"+prospecto.id, true);
          this.prospecto = {...result.data};
          this.showDialog = true;
        },
        confirmDeleteProspecto(prospecto) {
            this.prospecto = prospecto;
            this.deleteProspectoDialog = true;
        },
        async deleteProspecto() {
          const id = this.prospecto.id;
          const result = await sendRequest('DELETE', {id: id},url+"/prospectos/"+id); 
          if (result === "ok") {
            this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Prospecto eliminado', life: 3000});
          } else {
            this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
          }
          this.deleteProspectoDialog = false;
          this.prospecto = {};
          this.getProspectos();
        }        
      }
    }
  </script>
<style>
.p-column-filter-menu-button{
  visibility:hidden;
}
</style>