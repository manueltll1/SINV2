<template>
  <Toast />  
  <div class="container">
    <div class="search-container">
      <Toolbar class="padding-0">
        <template #start>
          <div class="toolbar-container-cotization mb-10">
            <div style="display: inline-block; vertical-align: middle; padding-right: 10px;">
              <svg @click="searchDialog = true" style="cursor: pointer;" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g fill="rgb(0,0,0)"><path d="m3 2c-.55228 0-1 .44772-1 1s.44772 1 1 1h18c.5523 0 1-.44772 1-1s-.4477-1-1-1z"/><g clip-rule="evenodd" fill-rule="evenodd"><path d="m2 7c0-1.10457.89543-2 2-2h2c1.10457 0 2 .89543 2 2v13c0 1.1046-.89543 2-2 2h-2c-1.10457 0-2-.8954-2-2zm2 0h2v13h-2z"/><path d="m11 5c-1.10457 0-2 .89543-2 2v9c0 1.1046.89543 2 2 2h2c1.1046 0 2-.8954 2-2v-9c0-1.10457-.8954-2-2-2zm2 2h-2v9h2z"/><path d="m16 7c0-1.10457.8954-2 2-2h2c1.1046 0 2 .89543 2 2v5c0 1.1046-.8954 2-2 2h-2c-1.1046 0-2-.8954-2-2zm2 0h2v5h-2z"/></g></g></svg>
            </div>
            <Dropdown 
              v-model="selectedTablero" 
              :options="tableros" 
              filter
              optionValue="id"
              optionLabel="nombre"
              :placeholder="this.tablero_nombre"
              class="w-full md:w-14rem dd-cotization"
              @change="changeBoard()"
            />
          </div>
        </template>        
        <template #end>
          <FilterCards :general="false" @params="filterCards" />
        </template>        
      </Toolbar>
    </div>
    <!-- Listado de columnas y tarjetas -->  
    <div class="second-row-scroll">
      <div v-if="can('columnas.index')">
        <draggable class="list-draggable" :list="listas" group="columnas" ghostClass="ghost" @update="moveList" :disabled="!can('columnas.switch')">          
        <div v-for="(list, index) in listas" :key="index" class="list-card col px-1 py-3 bg-light border rounded">
          <div class="column list-header align-items-center" :style="{ 'background-color': list.color }">
            <div v-if="can('columnas.update')">
              <Button class="list-name" link @click="editColumna(list)" :label="list.nombre"/>
            </div> 
            <div v-else>
              <label class="px-2">{{ list.nombre }}</label>
            </div>
            <div v-if="can('tarjetas.store')" class="float-right">
              <div v-if="list.posicion == 1">
                <Button severity="secondary" icon="pi pi-plus b-add-card" @click="addTarjeta()" text rounded/>
              </div>
            </div>            
          </div>
        
          <div class="list-content"> 
            <draggable :list="list.tarjetas" group="tarjetas" @change="handleDragChange">
            <div v-for="(tarjeta, i) in list.tarjetas" :key="i">
              <Tarjeta :tarjeta="tarjeta" :tipo_lista="list.tipo" @datos="recibirValor"/>                            
            </div>
            </draggable>          
          </div>
        </div>
        <Button v-if="can('columnas.store')" label="Agregar otra lista" class="input-new-list" text raised icon="pi pi-plus" @click="formColumna()" />
        </draggable>
      </div>
    </div>
    <!-- Listado de columnas y tarjetas -->  
  </div>
  <Dialog v-model:visible="columnaDialog" header="Lista" @show="adjustScroll" @hide="resetScroll" :modal="true" class="p-fluid">  
    <div class="field">
      <label for="nombre">Nombre</label>
      <InputText id="nombre" v-model.trim="columna.nombre" maxlength="50" required="true" :class="{'p-invalid': submitted && !columna.nombre}" />
      <small class="p-error" v-if="submitted && !columna.nombre">El nombre es requerido.</small>
    </div>
    <div class="field">
      <label for="tipo" class="mb-3">Tipo</label>        
      <Dropdown v-model="columna.tipo" :options="tipos" optionLabel="name" optionValue="id" placeholder="seleccione un tipo" class="w-full md:w-20rem" />            
      <small class="p-error" v-if="submitted && !columna.tipo">El tipo es requerido.</small>
    </div>
    <div class="field">
      <label for="color" class="mb-3">Color</label>      
      <input type="color"  v-model="columna.color" class="mb-3">
    </div>
    <template #footer>
      <Button v-if="can('columnas.destroy') && columna.id" label="Eliminar" icon="pi pi-trash" text @click="confirmDelete(columna)" />
      <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
      <Button  v-if="can('columnas.update')" label="Guardar" icon="pi pi-check" text @click="saveColumna" />
    </template>
  </Dialog> 

  <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}"  :modal="true">
    <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="columna">Realmente desea eliminar la lista <b>{{columna.nombre}}</b>?</span>
    </div>
    <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteDialog = false"/>
        <Button label="Si" icon="pi pi-check" text @click="deleteColumna" />
    </template>
  </Dialog>
 
  <FormTarjeta :tarjeta="tarjeta" :tablero_id="tablero_id" :tarjetaDialog="tarjetaDialog" @datos="recibirValor" />

  
       
</template>
<script>  
  import { VueDraggableNext } from "vue-draggable-next";
  import { sendRequestList, sendRequest, userCan} from '@/helper';
  import { useUserStore } from "@/store/user";  
  import TarjetaComponent from '@/components/TarjetaComponent.vue';
  import FormTarjeta from '@/components/FormTarjeta.vue';
  import FilterCards from '@/components/FilterCards.vue';

  const url = import.meta.env.VITE_APP_BASE_URL;
  export default {
    components: {
      draggable: VueDraggableNext,      
      Tarjeta: TarjetaComponent,
      FormTarjeta,
      FilterCards
    },
    data() {
      return {
        tablero_id: this.$route.params.id,
        listas: null,        
        tipos: null,
        tiposTarjeta: null,        
        columna: {
          color:"#ff0000"
        },
        tarjeta: {},
        columnaDialog: false,
        deleteDialog: false,
        searchDialog: false,
        boardDialog: false,
        tarjetaDialog: false,
        submitted: false,
        user: useUserStore(),
        tipoTablero: "",
        selectedTablero: null,
        checklists_tarjeta: [],
        tableros: [],
        tablero_nombre: "",
        params: ""
      };
    },    
    methods: {
      async recibirValor(datos) {
        this.tarjetaDialog = datos.visible;
        
        if (datos.tarjeta) {          
          this.tarjeta = datos.tarjeta;
        }
        if (datos.columna) {
          this.getColumnas();
        }
      },
      changeBoard() {
        if (this.selectedTablero == 0) {
          this.$router.push('/tablerogeneral');
        } else {
          this.tablero_id = ""+this.selectedTablero;
          this.getColumnas();
        }        
      },
      handleDragChange(event) {
        var column_to = 0;
        var tarjeta = {};
        if (event.added) { // si el movimiento es entre columnas          
          tarjeta = event.added.element;
          if (tarjeta.estatus == "activa") {
            for (let item of this.listas) {
              if(item.tarjetas.length > item.num_tarjetas) {
                column_to = item.id;
                break;
              }
            }
            if (column_to > 0) {            
              this.moveCard(tarjeta, column_to, event.added.newIndex);
            }
          } else {
            this.$toast.add({severity:'error', summary: 'Error', detail: "La tarjeta está bloqueada y no es posible moverla", life: 3000});
          }
        } 
        if (event.moved) { // si el movimiento es cambio de nivel
          tarjeta = event.moved.element;
          if (tarjeta.estatus == "activa") {
            this.exchange(tarjeta, event.moved.newIndex, event.moved.oldIndex);
          } else {
            this.$toast.add({severity:'error', summary: 'Error', detail: "La tarjeta está bloqueada y no es posible moverla", life: 3000});
          }
        }

        this.getColumnas();
      },
      async getTableros(){
          const result = await sendRequestList(url+"/tableroslist");
          this.tableros = result.data.data;
          const tablero_todo = { id: 0, nombre: 'Todo' };
          this.tableros.unshift(tablero_todo);
      },
      async exchange(tarjeta, new_index, old_index) {
        var result = "";        
        var params = {
          new_index: new_index,
          old_index: old_index          
        };
        result = await sendRequest(
          "PUT",
          params,
          url+"/exchangecards/"+tarjeta.id
        );
        if(!result) {
          this.$toast.add({severity:'error', summary: 'Error', detail: "Error al actualizar las posiciones", life: 3000});
        } else {
          this.getColumnas();
        }        
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
      async getColumnas() {
        const result = await sendRequestList(
            url+"/columnas"+this.params+"&tablero_id="+this.tablero_id
        );
        
        this.listas = result.data.data;
      },
      filterCards(params) {
        if(params == null) {
          this.params = "?filtro=responsable&xprioridad=true&orden=tiempo&texto=&estatus=&usuarios=&ramo=&subramo=&fechainicio=&fechafin=";
        } else {
          this.params = params.params;
        }
        
        this.getColumnas();
      },
      async moveList(event) {
        var result = "";        
        var params = {
          tablero_id: this.tablero_id,
          new_position: event.newDraggableIndex+1,
          old_position: event.oldDraggableIndex+1
        };
        result = await sendRequest(
          "PUT",
          params,
          url+"/switchcolumns"
        );
        if(!result) {
          this.$toast.add({severity:'error', summary: 'Error', detail: "Error al actualizar las posiciones", life: 3000});
        }
      },
      formColumna() {        
        this.columnaDialog= true;
        this.getTipos();        
      },
      async getTipos(){
        this.loading = true;
        const result = await sendRequestList(url+"/tiposcolumnas");
        this.tipos = result.data;            
      },
      async saveColumna() {
        this.submitted = true;
        var message = "";
        var result = "";                

        if (this.columna.nombre && this.columna.nombre != '' && this.columna.tipo && this.columna.tipo != '' ) {
          var params = {
            nombre: this.columna.nombre.trim(),
            tipo: this.columna.tipo,
            tablero_id: this.tablero_id,
            color: this.columna.color
          };
          if(this.columna.id) {
            params.posicion = this.columna.posicion;
            message = "Columna actualizada";
            result = await sendRequest(
              "PUT",
              params,
              url+"/columnas/"+this.columna.id
            );
            
          } else {
            message = "Columna registrada";
            result = await sendRequest(
              "POST",
              params,
              url+"/columnas",
            );
          }

          if (result === "ok") {                      
            this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});
            this.getColumnas();
            this.hideDialog();
          } else {
              this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
          }
        }
      },
      async editColumna(columna) {        
        this.getTipos();
        const result = await sendRequest('GET', {},url+"/columnas/"+columna.id, true);
        this.columna = {...result.data};            
        this.columnaDialog = true;        
      },
      hideDialog() {
        this.columnaDialog = false;
        this.submitted = false;
        this.columna = {};
      },
      confirmDelete(columna) {        
        this.columna = columna;
        this.deleteDialog = true;
      },
      async deleteColumna() {
        const id = this.columna.id;        
        const result = await sendRequest('DELETE', {id: id},url+"/columnas/"+id); 
        if (result === "ok") {
          this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Lista eliminada', life: 3000});
        } else {
          this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
        }
        this.deleteDialog = false;
        this.columnaDialog = false;
        this.columna = {};
        this.getColumnas();
      },
      addTarjeta() {
        this.tarjeta = {};
        this.tarjetaDialog = true;
      },
      can(action) {
        return userCan(action);
      },
      adjustScroll() {
        const maxScrollRight = document.documentElement.scrollWidth - window.innerWidth;        
        window.scrollTo({ left: maxScrollRight, behavior: 'auto' });
      },
      resetScroll() {        
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      },
      async getTipoTablero() {
        const result = await sendRequest('GET', {},url+"/tableros/"+this.tablero_id, true);
        const tablero = {...result.data};                      
        this.tipoTablero = tablero.tipo;
      },
      getTableroId(){
        this.selectedTablero = this.tablero_id;
      },
    },
    async mounted() {
        await this.getTableros();
        this.filterCards();
        this.getTipoTablero();
        this.getTableroId();
        if(this.tableros) {
          const tablero = this.tableros.find(item => item.id == this.tablero_id);
          if (tablero) {
            this.tablero_nombre = tablero.nombre;
          }
        }                
    },
    watch: {
      tarjetaDialog(){
        if (this.tarjetaDialog == false) {
          this.tarjeta = {};
          this.checklists_tarjeta= [];
          this.getColumnas();
        }        
      },
    }
  }
  
  </script>
  <style scoped>
  .list-draggable {
    display: flex;
    gap: 10px;
    height: 76vh;
    flex: 0 0 auto;
    min-width: 100px;
    padding: 0 10px 10px 10px;
    margin-right: 10px;
    background-color: #9598A8;
  }

  .container {
    padding: 1px;
  }

  .first-row {
    display: flex;    
    border: 0px;
    width: 100%;  
    z-index: 9999;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .second-row-scroll {
    display: flex;
    overflow-x: auto; /* Agrega scroll horizontal */
    border: 0px;
  }

  .column {
    flex: 0 0 auto; /* Para evitar que las columnas se estiren */
    min-width: 100px; /* Ancho mínimo de las columnas */
    padding: 5px;
    border: 0px solid #ccc;
    margin-right: 10px; /* Espacio entre columnas */
  }

  .custom-input {
    background-color: #ECECEC;
    border: none;
  }

  .d-inline-block {
    display: inline-block;
  }

  .d-inline-flex {
    display: inline-flex;
  }

  .list-card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 220px;
    height: auto;
  }

  .list-content {
    overflow-y: auto; 
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 220px;
    max-width: 220px;
    min-height: 150px;
    background-color: rgb(241 242 245);
    border-radius: 0px 0px 10px 10px;
    padding: 20px 10px 0px 10px;
    box-shadow: 10px 10px 20px -8px rgba(0, 0, 0, 0.69);
    color: rgba(24, 43, 77, 1);
  }

  .list-name {
    color: #fff !important;
  }

  .dd-cotization {
    width: 80% !important;
    border: none;
  }

  .element-card {
    flex-grow: 1; /* Hace que cada elemento ocupe el espacio disponible */
    flex-basis: 0;
    position: relative;
    background-color: white;
    height: auto;
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    min-height: 30px;
    margin-bottom: 10px;
    word-break: break-all;
    text-align: left;
  }

  .float-right {
    float: right;
  }

  .list-header {
    position: relative;
    display: flex;
    justify-content: center;
    word-break: break-all;
    align-items: center;
    min-width: 220px;
    max-width: 220px;
    line-height: 24px;
    padding: 8px;
    background-color: rgb(241 242 245);
    border-radius: 8px 8px 0px 0px;
    color: rgb(241 242 245);
    user-select: none;   
    margin-right: 0px !important; 
    font-weight: bold;
  }

  .high-priority {
    border: 2px solid red;
  }

  .medium-priority {
    border: 2px solid yellow;
  }

  .low-priority {
    border: 2px solid green;
  }

  .p-10 {
    padding: 0 10px !important;
  }

  .mb-10 {
    margin-bottom: 10px !important;
  }

  .tarjeta {
    padding: 0;
    width: 100%;
    margin-bottom: 20px;
    overflow: visible;
    border-radius: 4px;
    position: relative;
    box-shadow: 7px 8px 7px -7px rgba(0, 0, 0, 1);
  }

  .padding-0 {
    padding: 0;
  }
  
  .p-button {
    padding: 4px 4px;
    text-decoration: none !important;
    background-color: transparent !important;
    border-color: transparent !important;
  }

  .p-button-secondary {
    background-color: #fff !important;
    padding: 5px !important;
    border-radius: 50% !important;
    color: #9296A6 !important;
  }

  .p-toolbar {
    background-color: transparent;
    border: none;
  }

  .toolbar-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 5px 10px;
    min-height: 3.2rem;
  }

  .toolbar-container-filter {
    background-color: #D4EBF4;
    border-radius: 10px;
    padding: 9px 10px;
    min-height: 3.2rem;
  }

  .toolbar-container-cotization {
    background-color: #fff;
    border-radius: 10px;
    padding: 2.8px 10px;
    min-height: 3.2rem;
    width: 220px;
  }

  .p-toolbar-group-start {
    width: 220px !important;
  }

  .input-new-list {
    background-color: #ecf0fc;
    gap: 20px;
    display: flex;
    height: 30px;
    border-radius: 10px;
    min-width: 260px;
    margin-top: 20px;
    padding: 4px 4px;
    text-decoration: none !important;
    border-color: #ecf0fc;
  }

  .mr-20 {
    margin-right: 20px;
  }

  .pdl-10 {
    padding-left: 10px;
  }

  .pdr-10 {
    padding-right: 10px;
  }

  .search-container {
    padding-left: 1rem;
  }

  .p-inputtext {
    padding: 0.75rem 0.75rem;
  }

</style>