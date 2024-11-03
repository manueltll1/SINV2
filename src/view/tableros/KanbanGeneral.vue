<template>
    <Toast />     
    <div class="container">
        <div class="search-container">
            <Toolbar class="padding-0">
                <template #start>
                  <div class="toolbar-container-cotization">
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
                  <FilterCards :general="true" @params="filterCards" />
                </template>        
            </Toolbar>
        </div>
        <div class="second-row-scroll">
            <div class="list-draggable">
                <div v-for="(list, index) in listas" :key="index">
                    <div v-for="(tarjetas, key) in list" :key="key" class="list-card col px-1 py-3 bg-light border rounded">
                        <div class="column list-header align-items-center" :style="{ 'background-color': list.color }">
                            <label class="px-2">{{ key }}</label>
                        </div>
                        <div class="list-content">
                            <div v-for="(tarjeta, i) in tarjetas" :key="i">
                                <Tarjeta :tarjeta="tarjeta" :tipo_lista="key" @datos="recibirValor"/>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
    </div>

    <FormTarjeta :tarjeta="tarjeta" :tablero_id="tablero_id" :tarjetaDialog="tarjetaDialog" @datos="recibirValor" />
</template>
<script>
import { sendRequestList, sendRequest} from '@/helper';
import TarjetaComponent from '@/components/TarjetaComponent.vue';
import FormTarjeta from '@/components/FormTarjeta.vue';
import FilterCards from '@/components/FilterCards.vue';

const url = import.meta.env.VITE_APP_BASE_URL;

export default {
    components: {
      Tarjeta: TarjetaComponent,
      FormTarjeta,
      FilterCards
    },
    data() {
        return {
            filterCard: "",
            dates: null,
            listas: null,
            searchDialog: false,
            tarjetaDialog: false,
            tarjeta: {},
            tablero_id: "",
            tableros: [],
            selectedTablero: 0,
            tablero_nombre: "",
            params: ""
        }        
    },
    methods: {
        recibirValor(datos) {              
          if (datos.tarjeta) {          
            this.tarjeta = datos.tarjeta;
            this.tablero_id = ""+datos.tarjeta.tablero_id;
          }

          if (datos.columna) {
            this.moveCard(this.tarjeta, datos.columna, 0);
          }

          if (datos.visible == false) {
            this.tarjeta = {};
          }
          this.tarjetaDialog = datos.visible;
          this.getColumnas();

        },
        filterCards(params) {
          if(params == null) {
            this.params = "?filtro=responsable&xprioridad=true&orden=tiempo&texto=&estatus=&usuarios=&ramo=&subramo=&fechainicio=&fechafin=";
          } else {
            this.params = params.params;
          }
          
          this.getColumnas();
        },
        async getColumnas() {
            const result = await sendRequestList(
                url+"/tablerogeneral"+this.params
            );

            this.listas = result.data;
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
        showSearchDialog() {
          this.searchDialog = true
        },
        changeBoard() {
          if (this.selectedTablero > 0 ) {
            this.$router.push('/tablero/'+this.selectedTablero);
          }
        },
        async getTableros(){
          const result = await sendRequestList(url+"/tableroslist");
          this.tableros = result.data.data;
          const tablero_todo = { id: 0, nombre: 'Todo' };
          this.tableros.unshift(tablero_todo);
        },
    },
    mounted() {
        this.getTableros();
        this.filterCards();
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
    padding: 10px;
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
    color: rgba(24, 43, 77, 1);
    user-select: none;   
    margin-right: 0px !important; 
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
    background-color: #fff;
    border-radius: 10px;
    padding: 9px 10px;
    min-height: 3.2rem;
  }

  .toolbar-container-cotization {
    background-color: #fff;
    border-radius: 10px;
    padding: 5px 10px;
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

</style>