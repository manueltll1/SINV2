<template>
    <div class="toolbar-container-filter d-inline-flex mr-20">
        <Button label="Filtros" icon="pi pi-filter" text @click="toggleShowFiltros"/>
    </div>
    <div class="toolbar-container">
        <div class="d-inline-block align-items-center pdl-10 pdr-10">          
        <b><label>Buscar&nbsp;</label></b>
        </div>
        <div class="d-inline-block align-items-center">
        <InputText id="filterCard" v-model="filterCard" @keydown.enter="setParams()" placeholder="" type="text" class="w-full md:w-15rem sm:w-auto custom-input" />
        </div>
    </div>
    <Popover ref="showfiltros" >
        <div class="confirmation-content">
            <div class="field flex flex-wrap gap-5 mb-5" >
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-search mr-3" style="font-size: 2rem" />
                    <b><label>BUSQUEDA AVANZADA</label></b>
                </div>
                <div class="flex align-items-center gap-2" v-if="general">
                    <svg @click="searchDialog = true" style="cursor: pointer;" fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><g fill="rgb(0,0,0)"><path d="m3 2c-.55228 0-1 .44772-1 1s.44772 1 1 1h18c.5523 0 1-.44772 1-1s-.4477-1-1-1z"/><g clip-rule="evenodd" fill-rule="evenodd"><path d="m2 7c0-1.10457.89543-2 2-2h2c1.10457 0 2 .89543 2 2v13c0 1.1046-.89543 2-2 2h-2c-1.10457 0-2-.8954-2-2zm2 0h2v13h-2z"/><path d="m11 5c-1.10457 0-2 .89543-2 2v9c0 1.1046.89543 2 2 2h2c1.1046 0 2-.8954 2-2v-9c0-1.10457-.8954-2-2-2zm2 2h-2v9h2z"/><path d="m16 7c0-1.10457.8954-2 2-2h2c1.1046 0 2 .89543 2 2v5c0 1.1046-.8954 2-2 2h-2c-1.1046 0-2-.8954-2-2zm2 0h2v5h-2z"/></g></g></svg>
                    <Dropdown v-model="tablero_id" :options="tableros" optionLabel="nombre" optionValue="id" placeholder="Tablero" class="w-full md:w-12rem" showClear  @change="filtroTablero()" />
                </div>
            </div>
            <div class="field flex flex-wrap gap-5 mb-5">
                <div class="align-items-center ">          
                    <b><label>Filtrar por:</label></b>
                </div>
                <!-- En pantallas pequeñas se alinean en columna, en pantallas medianas se alinean en fila -->
                <div class="flex flex-column md:flex-row gap-2">
                    <div class="flex align-items-center gap-2">
                        <RadioButton v-model="filtro" inputId="filtro" name="filtro" value="responsable" @change="setParams()" />
                        <label for="Responsable" class="ml-2"><i class="pi pi-user-edit"></i> Responsable</label>
                    </div>
                    <div class="flex align-items-center gap-2">
                        <RadioButton v-model="filtro" inputId="filtro" name="filtro" value="observador" @change="setParams()" />
                        <label for="Observador" class="ml-2"><i class="pi pi-eye"></i> Observador</label>
                    </div>
                    <div class="flex align-items-center gap-2">
                        <RadioButton v-model="filtro" inputId="filtro" name="filtro" value="todas" @change="setParams()" />
                        <label for="Todas" class="ml-2"><i class="pi pi-bullseye"></i> Todas</label>
                    </div>
                </div>
            </div>
            <div class="field flex flex-wrap gap-5 mb-5">
                <div class="align-items-center">          
                    <b><label>Ordenar por:</label></b>
                </div>
                <div class="flex align-items-center gap-2">
                    <Checkbox v-model="xprioridad" :binary="true" inputId="xprioridad" name="xprioridad" @change="setParams()"/>
                    <label for="xprioridad" class="ml-2"><i class="pi pi-exclamation-circle"></i> Prioridad </label>
                </div>          
                <div class="flex align-items-center gap-2">
                    <RadioButton v-model="ordenar" inputId="ordenar" name="ordenar" value="tiempo" @change="setParams()" />
                    <label for="Tiempo" class="ml-2"><i class="pi pi-clock"></i> Tiempo</label>
                </div>
                <div class="flex align-items-center gap-2">
                    <RadioButton v-model="ordenar" inputId="ordenar" name="ordenar" value="recientes" @change="setParams()" />
                    <label for="Recientes" class="ml-2"><i class="pi pi-calendar-clock"></i> Recientes</label>
                </div>
            </div>
            <div class="field flex flex-wrap gap-5 mb-5">
                <b><label>Mostrar:</label></b>
                <div class="flex align-items-center gap-2">
                    <Checkbox v-model="xestatus" :binary="true" inputId="xestatus" name="xestatus" @change="setParams()"/>
                    <label for="xestatus" class="ml-2"><i class="pi pi-lock"></i> Bloqueadas </label>
                </div>
                <div class="flex align-items-center gap-2">           
                    <Checkbox v-model="archivada" :binary="true" inputId="archivada" name="archivada" @change="setParams()"/>
                    <label for="archivada" class="ml-2"><i class="pi pi-folder"></i>  Archivadas </label>
                </div>
            </div>
            <div class="field flex flex-wrap gap-5 mb-5">
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-search"></i>
                    <InputText id="filterCard" v-model="filterCard" @keydown.enter="setParams()" placeholder="Número ó descripción" type="text" class="w-full md:w-12rem" />
                </div>
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-user"></i>
                    <AutoComplete
                        v-model="selectedCliente"
                        :suggestions="filteredClientes"
                        @complete="searchClientes"
                        field="nombreCompleto"
                        class="w-full md:w-12rem"
                        placeholder="Cliente"
                        @change="onClienteSelected"
                    />
                </div>
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-file"></i>
                    <AutoComplete
                        v-model="selectedPoliza"
                        :suggestions="filteredPolizas"
                        @complete="searchPolizas"
                        field="no_poliza"
                        class="w-full md:w-12rem"
                        placeholder="Poliza"
                        @change="onPolizaSelected"
                    >
                        <template #option="slotProps">
                            <div>
                            {{ slotProps.option.no_poliza.replace(/\s+/g, '') }} - {{ slotProps.option.concepto }}
                            </div>
                        </template>
                    </Autocomplete>
                </div>
            </div>
            <div class="field flex flex-wrap gap-5 mb-5">
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-building"></i>
                    <MultiSelect
                        v-model="selectedCias"
                        :options="cias"
                        optionLabel="iniciales"
                        filter
                        display="chip"
                        placeholder="Compañías"
                        :maxSelectedLabels="3"
                        class="w-full md:w-12rem"
                        @change="onCiaSelected"
                    >
                        <template #option="slotProps">
                            <div>
                                {{ slotProps.option.nombre }}
                            </div>                            
                        </template>
                        <template #footer>
                            <div>
                                <b>{{ this.cias ? this.cias.length : 0 }}</b> item{{ (this.cias ? this.cias.length : 0) > 1 ? 's' : '' }} selected.
                            </div>
                        </template>
                    </MultiSelect>
                </div>
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-dollar"></i>
                    <AutoComplete
                        v-model="selectedVendedor"
                        :suggestions="filteredVendedor"
                        @complete="searchVendedor"
                        field="nombre"
                        placeholder="Vendedor"
                        class="w-full md:w-12rem"
                        @change="onVendedorSelected"
                    />
                </div>
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-users"></i>            
                    <MultiSelect v-model="users_ids" :options="this.usuarios" filter optionLabel="name" optionValue="id" placeholder="Responsables" class="w-full md:w-12rem" @change="setParams()"/>
                </div>
            </div>
            <div class="field flex flex-wrap gap-5 mb-5">
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-briefcase"></i>            
                    <Dropdown v-model="categoria_id" :options="categorias" optionLabel="nombre" optionValue="id" placeholder="Categoría"  showClear class="w-full md:w-12rem"  @change="filtroCategoria()" />
                </div>
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-flag-fill"></i>            
                    <Dropdown v-model="ramo_id" :options="ramos" optionLabel="nombre" optionValue="id" placeholder="Ramo"  showClear class="w-full md:w-12rem"  @change="filtroRamo()" />
                </div>
                <div class="flex align-items-center gap-2">  
                    <i class="pi pi-flag"></i>          
                    <Dropdown v-model="subramo_id" :options="subramos" optionLabel="nombre" optionValue="id" placeholder="Subramo" showClear class="w-full md:w-12rem"  @change="filtroSubramo()"/>
                </div>
            </div>
            
            <div class="field flex flex-wrap gap-5 mb-5">
                <b><label>Por rango de fechas:</label></b>
                <div class="align-items-center">            
                    <Dropdown v-model="opcion" :options="opciones" optionLabel="nombre" optionValue="id" placeholder="Seleccione" class="w-full md:w-15rem" :showClear=true @change="filterDates()"/>
                </div>
                <div class="align-items-center">            
                    <Calendar v-model="dates" selectionMode="range" :manualInput="false" dateFormat="dd/mm/yy" :showButtonBar=true :showIcon=true @hide="filterDates()"/>
                </div>
            </div>
    
        </div>
        
        
        <template #footer>
            <Button label="Cerrar" icon="pi pi-times" text @click="searchDialog = false"/>
        </template>
    </Popover> 
</template>

<script>
import { sendRequestList } from '@/helper';

const url = import.meta.env.VITE_APP_BASE_URL;

export default {
    emits: ['params'],
    props: {
        general: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            searchDialog: false,
            params: "",
            filterCard: "",
            users_ids: [],
            usuarios: null,
            ramo_id: '',
            subramo_id: '',
            categoria_id: '',
            tablero_id: '',
            ramos: [],
            subramos: [],
            categorias: [],
            tableros: [],
            filtro: "responsable",
            ordenar: "tiempo",
            xprioridad: true,
            xestatus: false,
            archivada: false,
            fechaInicio: "",
            fechaFin: "",
            selectedCliente: "",
            filteredClientes: [],
            selectedClienteId: "",
            selectedPolizaId: "",
            selectedPoliza: null,
            filteredPolizas: [],
            selectedVendedor: [],
            filteredVendedor: [],
            selectedVendedorId: "",
            selectedCias: [],
            cias: [],
            filteredCia: [],
            opciones: [
                {
                    'id' : 'started_at',
                    'nombre' : 'Inicio'
                },
                {
                    'id' : 'fecha_termino',
                    'nombre' : 'Termino'
                }                
            ],
            opcion: '',
            between: '',
            dates:[]
        }
    },
    methods: {
        showSearchDialog() {
            this.searchDialog = true
        },
        setParams() {
            const filter_card = encodeURIComponent(this.filterCard);
            var estatus = "";
            var filter_users = [];
            if(this.xestatus == true) {
                estatus = "bloqueada";
            }
            if(this.users_ids.length > 0) {
                filter_users= this.users_ids;
            }

            this.params = "?filtro="+this.filtro+
                "&xprioridad="+this.xprioridad+
                "&orden="+this.ordenar+
                "&texto="+filter_card+
                "&estatus="+estatus+
                "&usuarios="+filter_users+
                "&ramo="+this.ramo_id+
                "&subramo="+this.subramo_id+
                "&categoria="+this.categoria_id+
                "&tablero="+this.tablero_id+
                "&cliente="+this.selectedClienteId+
                "&poliza="+this.selectedPolizaId+
                "&vendedor="+this.selectedVendedorId+
                "&cias="+this.filteredCia+
                "&archivadas="+this.archivada+
                "&fechainicio="+this.fechaInicio+
                "&fechafin="+this.fechaFin+
                "&between="+this.between;
            
            this.$emit('params', { params: this.params });
        },
        async getUsuarios(){
            this.loading = true;
            const result = await sendRequestList(url+"/userslist");
            this.usuarios = result.data.data;
        },
        async getRamos(){
            this.loading = true;
            const result = await sendRequestList(url+"/ramoslist");
            this.ramos = result.data.data;        
        },
        async getSubRamos(){
            this.loading = true;
            const result = await sendRequestList(url+"/subramoslist?ramo_id="+this.ramo_id);
            this.subramos = result.data.data;        
        },
        async getCategorias() {
            const result = await sendRequestList(url+"/categoriaselect");
            this.categorias = result.data;            
        },
        async getTableros(){
          const result = await sendRequestList(url+"/tableroslist");
          this.tableros = result.data.data;
        },
        async getCias(){
            this.loading = true;
            const result = await sendRequestList(url+"/cialist");
            this.cias = result.data.data;
            this.loading = false;
        },
        filtroRamo() {
            if (this.ramo_id == null) {
            this.ramo_id = '';
            this.subramo_id = '';
            this.subramos = [];
            } else {
            this.getSubRamos();
            }
            this.setParams();
            
        },
        filtroSubramo() {
            if (this.subramo_id == null) {
            this.subramo_id = '';
            }
            this.setParams();
        },
        filtroCategoria() {
            if (this.categoria_id == null) {
                this.categoria_id = '';
            }
            
            this.setParams();
        },
        filtroTablero() {
            if (this.tablero_id == null) {
                this.tablero_id = '';
            }
            
            this.setParams();
        },
        filterDates() {
          if (this.dates && this.dates.length > 0 && this.opcion && this.opcion != '') {
            this.fechaInicio = this.fechaFormateada(this.dates[0]);
            this.fechaFin = this.fechaFormateada(this.dates[1]);
            this.between = this.opcion;
          } else {
            this.fechaInicio = "";
            this.fechaFin = "";
            this.between = "";
          }

          this.setParams();
        },
        fechaFormateada(fecha) {
          const anio = fecha.getFullYear();
          const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
          const dia = fecha.getDate().toString().padStart(2, '0');            
            
          return `${dia}/${mes}/${anio}`;
        },
        toggleShowFiltros(event){
            this.$refs.showfiltros.toggle(event);
        },
        async searchClientes(event) {
            // Aquí puedes implementar la búsqueda dinámica, por ejemplo, filtrando la lista o haciendo una consulta al servidor
            const query = event.query;
            // Reemplaza los espacios con %20 para la consulta (URL encoding)
            const encodedQuery = encodeURIComponent(query);
            // Realiza la solicitud a la API usando la búsqueda por nombre
            const result = await sendRequestList(url + `/quattro_clientes/buscacliente/` + encodedQuery);
            // Mapea la respuesta para agregar el campo nombreCompleto
            this.filteredClientes = result.data.map(cliente => ({
                ...cliente,
                nombreCompleto: `${cliente.nombre} ${cliente.ap_pat} ${cliente.ap_mat}`
            }));
        },
        onClienteSelected(cliente) {
            if(cliente.value.id) {
                this.selectedClienteId = cliente.value.id;
                this.setParams();
            }
        },
        async searchPolizas(event) {
            // Aquí puedes implementar la búsqueda dinámica, por ejemplo, filtrando la lista o haciendo una consulta al servidor
            const query = event.query;

            let result; // Declarar la variable result fuera del bloque if
            // Verifica si clienteSelectedId no es nulo
            if (this.selectedClienteId !== "") {
                // Si clienteSelectedId no es nulo, utiliza la búsqueda por el nombre de cliente
                result = await sendRequestList(url + `/quattro_polizas/buscapolxidcli/` + this.selectedClienteId);
                this.filteredPolizas = result.data.filter(poliza =>
                    poliza.no_poliza.toLowerCase().includes(query.toLowerCase()))
            } else {
                // Si clienteSelectedId es nulo, busca las pólizas que coincidan con el input
                result = await sendRequestList(url + `/quattro_polizas/buscapoliza/` + query);
                this.filteredPolizas = result.data;
            }

        },
        onPolizaSelected(poliza) {
            if(poliza.value.ot) {
                this.selectedPolizaId = poliza.value.ot;
                this.setParams();
            }
        },
        onVendedorSelected(vendedor) {
            if(vendedor.value.id) {
                this.selectedVendedorId = vendedor.value.id;
                this.setParams();
            }
        },
        onCiaSelected() {
            var cias = [];
            if (this.selectedCias && this.selectedCias.length > 0) {
                this.selectedCias.forEach(
                    cia => cias.push(cia.id)
                )

                this.filteredCia = cias;
                this.setParams();
            }

        },
        async searchVendedor(event) {
            const query = event.query;

            var result = await sendRequestList(url + "/listvendedores");
            if (result.data.data.length > 0) {
                const filtered = result.data.data.filter(persona => {
                    // Validar que los campos existan antes de usar toLowerCase()
                    const nombres = persona.nombres ? persona.nombres.trim().toLowerCase() : "";
                    const paterno = persona.paterno ? persona.paterno.trim().toLowerCase() : "";
                    const materno = persona.materno ? persona.materno.trim().toLowerCase() : "";
                    const razon_social = persona.razon_social ? persona.razon_social.trim().toLowerCase() : "";

                    // Filtrar si al menos uno de los campos no está vacío y coincide con la consulta
                    const fullName = `${nombres} ${paterno} ${materno}`.trim();
                    return (fullName || razon_social) && (fullName.includes(query.toLowerCase()) || razon_social.includes(query.toLowerCase()));
                });

                if (filtered.length > 0) {
                    this.filteredVendedor = filtered.map(persona => {
                        // Crear la cadena de nombre completo si los nombres están presentes
                        const fullName = [persona.nombres, persona.paterno, persona.materno]
                            .filter(Boolean) // Filtrar los valores null o undefined
                            .join(" "); // Unir con espacios

                        // Usar razon_social si no hay nombre completo
                        const displayName = fullName || persona.razon_social;

                        // Retornar solo si displayName no es vacío
                        if (displayName) {
                            return {
                                id: persona.vendedor[0].id,
                                nombre: displayName
                            };
                        }
                    }).filter(vendedor => vendedor); // Filtrar los resultados nulos
                }
            }
        },
    },
    mounted() {
        this.getUsuarios();
        this.getRamos();
        this.getSubRamos();
        this.getCategorias();
        if (this.general) {
            this.getTableros();
        }
        this.getCias();
    },
    watch: {
        filter() {
            this.filterCard = this.filter;
        },
        selectedCliente() {
            if(this.selectedCliente == "") {
                this.selectedClienteId = "";
                this.setParams();
            }
        },
        selectedPoliza() {
            if(this.selectedPoliza == "") {
                this.selectedPolizaId = "";
                this.setParams();
            }
        },
        selectedVendedor() {
            if(this.selectedVendedor == "") {
                this.selectedVendedorId = "";
                this.setParams();
            }
        },
        selectedCias() {
            if(this.selectedCias.length == 0) {
                this.filteredCia = [];
                this.setParams();
            }
        }
    }
}
</script>
<style scoped>
    .toolbar-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 7.8px 10px;
    min-height: 3.2rem;
    }
   .toolbar-container-filter {
    background-color: #fff;
    border-radius: 10px;
    padding: 7px 10px;
    min-height: 3.2rem;
  }
  .d-inline-flex {
    display: inline-flex;
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
  .d-inline-block {
    display: inline-block;
  }

  .d-inline-flex {
    display: inline-flex;
  }
  .p-button {
    padding: 4px 4px;
    text-decoration: none !important;
    background-color: transparent !important;
    border-color: transparent !important;
  }
  .tarjeta-subheader-value {
    font-size: .9rem;
    color: #4E556F;
    font-weight: 500;
  }
</style>