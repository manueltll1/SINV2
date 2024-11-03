<template>
  <div class="grid  grid-cols-12 gap-4">
    <!-- Aquí vienen los filtros -->
    <div class="col-span-12 xl:col-span-12">
      <div class="flex flex-wrap items-start gap-4">
        <!-- Fecha Inicio -->
        <div class="col-6 lg:col-2 xl:col-2 card-element">
          <FloatLabel variant="on">
            <label for="fechaIni"  class="p-sr-only">Fecha Inicio</label>
            <DatePicker :showIcon="true" :showButtonBar="true" id="fechaIni" v-model="filters.ini" style="width: 150px;" dateFormat="dd/mm/yy" />
          </FloatLabel>
        </div>
        <!-- Fecha Fin -->
        <div class="col-6 lg:col-2 xl:col-2 card-element">
          <FloatLabel variant="on">
            <label for="fechafin" class="p-sr-only">Fecha Fin</label>
            <DatePicker  :showIcon="true" :showButtonBar="true" id="fechaFin" v-model="filters.fin" style="width: 150px;" dateFormat="dd/mm/yy" />
          </FloatLabel>
        </div>
        <!-- Ramo -->
        <div class="col-6 lg:col-1 xl:col-1 card-element">
          <Select v-model="filters.ramo" :options="ramosOptions" filter optionLabel="label" placeholder="RAMOS" class="w-full">
              <template #value="slotProps">
                  <span>{{ slotProps.value.label ? slotProps.value.label : 'RAMOS' }}</span>
              </template>
              <template #option="slotProps">
                  <span>{{ slotProps.option.label }}</span>
              </template>
          </Select>
        </div>
        <!-- Aseguradora -->
        <div class="col-6 lg:col-1 xl:col-1 card-element">
          <Select v-model="filters.aseguradora" :options="aseguradorasOptions" filter optionLabel="label" placeholder="ASEGURADORAS" class="w-full">
              <template #value="slotProps">
                  <span>{{ slotProps.value.label ? slotProps.value.label : 'ASEGURADORAS' }}</span>
              </template>
              <template #option="slotProps">
                  <span>{{ slotProps.option.label }}</span>
              </template>
          </Select>
        </div>
        <!-- Vendedor -->
        <div class="col-6 lg:col-1 xl:col-1 card-element">
          <Select v-model="filters.vendedor" :options="vendedoresOptions" filter optionLabel="label" placeholder="VENDEDORES" class="w-full">
              <template #value="slotProps">
                  <span>{{ slotProps.value.label ? slotProps.value.label : 'VENDEDORES' }}</span>
              </template>
              <template #option="slotProps">
                  <span>{{ slotProps.option.label }}</span>
              </template>
          </Select>
        </div>
        <!-- Cliente -->
        <div class="col-6 lg:col-1 xl:col-1 card-element">
          <Select v-model="filters.cliente" :options="clientesOptions" filter optionLabel="label" placeholder="CLIENTES" class="w-full">
              <template #value="slotProps">
                  <span>{{ slotProps.value.label ? slotProps.value.label : 'CLIENTES' }}</span>
              </template>
              <template #option="slotProps">
                  <span>{{ slotProps.option.label }}</span>
              </template>
          </Select>
        </div>
        <!-- Grupo -->
        <!-- <div class="field">
          <Select v-model="filters.grupo" :options="gruposOptions" filter optionLabel="label" placeholder="GRUPOS" class="w-full md:w-14rem">
              <template #value="slotProps">
                  <span>{{ slotProps.value.label ? slotProps.value.label : 'GRUPOS' }}</span>
              </template>
              <template #option="slotProps">
                  <span>{{ slotProps.option.label }}</span>
              </template>
          </Select>
        </div> -->
        <!-- Botón Aplicar Filtros -->
        <div class="col-12 lg:col-2 xl:col-2 card-element">
          <button class="p-button p-component w-full" @click="applyFilters">
            <span class="p-button-label">Aplicar Filtros</span>
            <span role="presentation" aria-hidden="true" class="p-ink"></span>
          </button>
        </div>
      </div>
      
    </div>
    <!-- Asegurados -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-2">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-3">
					<div>
						<span class="block text-500 font-medium mb-3">Asegurados</span>
            <div class="flex">
              <span class="block text-500 font-medium mb-3">2023</span>
              <div class="text-900 font-medium text-xl ml-3">{{ tclientes2023 }}</div>
            </div>
            <div class="flex">
              <span class="block text-500 font-medium mb-3">2024</span>
              <div class="text-900 font-medium text-xl ml-3">{{ tclientesHoy }}</div>
            </div>
					</div>
					<div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border  ml-auto" style="width: 2.5rem; height: 2.5rem">
              <i class="pi pi-users text-blue-500 !text-xl"></i>
          </div>
				</div>
				<div class="flex">
          <span class="text-green-500 font-medium">{{ tclientesGanados }} nuevos </span>
          <span class="text-red-500 font-medium ml-3">{{ tclientesPerdidos }} perdidos</span>
        </div>
			</div>
		</div>
    <!-- Pólizas -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-2">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-3">
					<div>
						<span class="block text-500 font-medium mb-3">Pólizas</span>
            <div class="flex">
              <span class="block text-500 font-medium mb-3">2023</span>
              <div class="text-900 font-medium text-xl ml-3">{{ p23 }}</div>
            </div>
            <div class="flex">
              <span class="block text-500 font-medium mb-3">2024</span>
              <div class="text-green-500 font-medium text-xl ml-3" :class="{'text-green-500': p24 >= p23, 'text-red-500': p24 < p23}">{{ p24 }}</div>
            </div>
					</div>
					<div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border  ml-auto" style="width: 2.5rem; height: 2.5rem">
						<i class="pi pi-file text-yellow-500 text-xl"></i>
					</div>
				</div>
				<div class="flex">
          <span class="text-500">Diferencia</span>
          <span class="font-medium ml-3" :class="{'text-green-500': dp > 0, 'text-red-500': dp < 0}">{{ dp }}</span>
        </div>
			</div>
		</div>
    <!-- Meta Renovación -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-2">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-2">
					<div>
						<span class="block text-500 font-medium mb-3">Meta Renovación</span>
            <div class="flex">
              <span class="block text-500 font-medium mb-3">Dif</span>
              <div class="text-900 font-medium text-xl ml-3">{{ dp }}</div>
            </div>
            <div class="flex">
              <span class="block text-500 font-medium mb-3">Can1</span>
              <div class="text-900 font-medium text-xl ml-3">{{ c1 }}</div>
            </div>
					</div>
					<div class="flex items-center justify-center bg-gray-100 dark:bg-gray-400/10 rounded-border  ml-auto" style="width: 2.5rem; height: 2.5rem">
						<i :class="mp > 0 ? 'pi pi-spin pi-star-fill text-yellow-500 text-xl' : 'pi pi-thumbs-down-fill text-yellow-500 text-xl'"></i>
					</div>
				</div>
				<div class="flex">
          <span class="text-500 text-xl">Total</span>
          <span class="font-medium ml-3 text-xl" :class="{'text-green-500': mp >= 0, 'text-red-500': mp < 0}">{{ mp }}</span>
        </div>
			</div>
		</div>
    <!-- Prima Neta -->
		<div class="col-span-12 lg:col-span-6 xl:col-span-3">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-3">
					<div>
						<span class="block text-500 font-medium mb-3">Prima Neta</span>
            <div class="flex">
              <span class="block text-500 font-medium mb-3">2023</span>
              <div class="text-900 font-medium text-xl ml-3">{{ formatCurrency(pn23) }}</div>
            </div>
            <div class="flex">
              <span class="block text-500 font-medium mb-3">2024</span>
              <div class="font-medium text-xl ml-3" :class="{'text-green-500': pn24 >= pn23, 'text-red-500': pn24 < pn23}">{{ formatCurrency(pn24) }}</div>
            </div>
					</div>
					<div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border  ml-auto" style="width: 2.5rem; height: 2.5rem">
						<i class="pi pi-dollar text-green-500 !text-xl"></i>
					</div>
				</div>
				<div class="flex">
          <span class="text-500">Diferencia</span>
          <span class="font-medium ml-3" :class="{'text-green-500': pn24 >= pn23, 'text-red-500': pn24 < pn23}">{{ formatCurrency(dpn) }}</span>
        </div>
			</div>
		</div>
    <!-- Meta Crecimiento -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-2">
					<div>
						<span class="block text-500 font-medium mb-3">Meta Crecimiento</span>
            <div class="flex">
              <span class="block text-500 font-medium mb-3">%Crecimiento</span>
              <div class="font-medium text-xl ml-3" :style="formatCrecimiento(cpn).style">{{ cpn+"%" }}</div>
            </div>
            <div class="flex">
              <span class="block text-500 font-medium mb-3">Meta</span>
              <div class="font-medium text-xl ml-3" :class="{'text-green-500': pn24 >= pn23, 'text-red-500': pn24 < pn23}">{{ formatCurrency(mpn) }}</div>
            </div>
					</div>
					<div class="flex items-center justify-center bg-gray-100 dark:bg-gray-400/10 rounded-border  ml-auto" style="width: 2.5rem; height: 2.5rem">
						<i :class="cpn > 0 ? 'pi pi-spin pi-star-fill text-yellow-500 text-xl' : 'pi pi-thumbs-down-fill text-yellow-500 text-xl'"></i>
					</div>
				</div>
				<div class="flex">
          <span class="text-500 text-xl">Avance</span>
          <span class="font-medium ml-3 text-xl" :class="{'text-green-500': apn[0] !== '-', 'text-red-500': apn[0] === '-'}">{{ apn }}</span>
        </div>
			</div>
		</div>
    <!-- Gráfica Primas -->
    <div class="col-span-12 lg:col-span-5 xl:col-span-5">
      <div class="card">
        <Chart type="bar" :data="chartData" v-if="chartData.labels.length" :options="chartOptions"></Chart>
      </div>
    </div>
    <!-- Clientes Perd/Gan -->
    <div class="col-span-12 lg:col-span-7 xl:col-span-7">
      <div class="card pb-0 pt-0">
        <!-- <h5>Clientes</h5> -->
        <Tabs value="0" style="font-size:0.8rem">
          <TabList>
            <Tab value="0">Perdidos</Tab>
            <Tab value="1">Ganados</Tab>
          </TabList>
            <TabPanel value="0" header="Nuevos">
              <DataTable tableStyle="min-width: 50rem" style="font-size:10px" :value="clientesGanados" :rows="3" :paginator="true" responsiveLayout="scroll">
                <Column field="cliente" header="Nombre"></Column>
              </DataTable>
            </TabPanel>
            <TabPanel value="1" header="Perdidos">
              <DataTable  tableStyle="min-width: 50rem" style="font-size:10px" :value="clientesPerdidos" :rows="3" :paginator="true" responsiveLayout="scroll">
                <Column field="cliente" header="Nombre"></Column>
              </DataTable>
            </TabPanel>
        </Tabs>
      </div>
    </div>
    <!-- Tabla Metas -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-12">
      <div class="card">
        <DataTable :value="tableCrecimiento" showGridlines tableStyle="max-width: 30rem">
            <Column field="mes" header="Mes"></Column>
            <Column field="valor2023" header="PN TC 2023"></Column>
            <Column field="valor2024" header="PN TC 2024"></Column>
            <!-- <Column field="crecimiento" header="% Crec" ></Column> -->
            <Column field="crecimiento" header="% Crec">
              <template #body="slotProps">
                  <span :style="formatCrecimiento(slotProps.data.crecimiento).style">
                      {{ formatCrecimiento(slotProps.data.crecimiento).text }}
                  </span>
              </template>
            </Column>
            <Column field="meta" header="Meta"></Column>
            <Column field="diferencia" header="Diferencia">
              <template #body="slotProps">
                <span :style="getStyleForDiferencia(slotProps.data.diferencia)">
                      {{ slotProps.data.diferencia }}
                  </span>
              </template>
            </Column>
            <Column field="Pol2023" header="Pol2023"></Column>
            <Column field="Pol2024" header="Pol2024"></Column>
            <Column field="DifR" header="DifR">
              <template #body="slotProps">
                <span :style="getStyleForDifR(slotProps.data.DifR)">
                      {{ slotProps.data.DifR }}
                  </span>
              </template>
            </Column>
            <Column field="Can1" header="Can1">
              <template #body="slotProps">
                <span :style="getStyleForDifR(slotProps.data.Can1)">
                      {{ slotProps.data.Can1 }}
                  </span>
              </template>
            </Column>
            <Column field="MetaRen" header="MetaRen">
              <template #body="slotProps">
                  <span :style="formatMetaRen(slotProps.data.MetaRen).style">
                      {{ formatMetaRen(slotProps.data.MetaRen).text }}
                  </span>
              </template>
            </Column>
            <Column field="CanTot" header="CanTot">
              <template #body="slotProps">
                <span :style="getStyleForDifR(slotProps.data.CanTot)">
                      {{ slotProps.data.CanTot }}
                  </span>
              </template>
            </Column>
        </DataTable>
      </div>
    </div>
    <!-- EmitidasINV -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-12">
      <div class="card">
        <DataTable v-model:filters="filtersEmitidasinv" class="p-datatable-sm" :value="records" paginator showGridlines :rows="20" dataKey="no_poliza" ref="dt_emitidasinv" filterDisplay="menu" :loading="loading" :globalFilterFields="['no_poliza', 'cliente', 'concepto', 'vendedor', 'grupo', 'ramo', 'aseguradora', 'estatus_mov','fec_vig_de']" scrollable scrollHeight="400px">
          <template #header>
            <div class="flex justify-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <!-- <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" /> -->
                <Button icon="pi pi-external-link" label="Export" @click="exportCSV" />
                <IconField>
                  <span class="p-input-icon-left">
                    <InputIcon>
                      <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filtersEmitidasinv['global'].value" placeholder="Keyword Search" />
                  </span>
                </IconField>
                
            </div>
          </template>
            <Column field="no_poliza" header="No. Poliza">
                <template #body="{ data }">{{ data.no_poliza }}</template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by No. Poliza" />
                </template>
            </Column>

            <Column header="Fec Vig De" filterField="fec_vig_de" dataType="date" style="min-width: 10rem">
              <template #body="{ data }">
                  {{ data.fec_vig_de }}
                  <!-- {{ formatDate(data.fec_vig_de) }} -->
                  
              </template>
              <template #filter="{ filterModel }">
                  <!-- <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999" /> -->
                  <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999" />

              </template>
            </Column>


            <Column field="pn_tc" header="PN TC">
                <template #body="{ data }">{{ formatCurrency(data.pn_tc) }}</template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by PN TC" />
                </template>
            </Column>

            <Column field="concepto" header="Concepto">
                <template #body="{ data }">{{ data.concepto }}</template>
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Concepto" />
              </template>
            </Column>

            <Column field="cliente" header="Cliente">
                <template #body="{ data }">{{ data.cliente }}</template>
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Cliente" />
                </template>
            </Column>

            <Column field="ramo" header="Ramo">
                <template #body="{ data }">{{ data.ramo }}</template>
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Ramo" />
                </template>
            </Column>

            <Column field="aseguradora" header="Aseguradora">
                <template #body="{ data }">{{ data.aseguradora }}</template>
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Aseguradora" />
                </template>
            </Column>

            <Column field="estatus_mov" header="Estatus Movimiento">
                <template #body="{ data }">{{ data.estatus_mov }}</template>
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Estatus" />
                </template>
            </Column>

            <Column field="vendedor" header="Vendedor">
                <template #body="{ data }">{{ data.vendedor }}</template>
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Vendedor" />
                </template>
            </Column>

            <Column field="tipo_movimiento" header="Tipo Movimiento">
                <template #body="{ data }">{{ data.tipo_movimiento }}</template>
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Tipo" />
                </template>
            </Column>

            <Column field="grupo" header="Grupo">
                <template #body="{ data }">{{ data.grupo }}</template>
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Grupo" />
                </template>
            </Column>

            <Column header="Fec Cancela" filterField="fec_cancelacion" dataType="date" style="min-width: 10rem">
              <template #body="{ data }">
                  {{ data.fec_cancelacion }}
                  <!-- {{ formatDate(data.fec_cancelacion) }} -->
                  
              </template>
              <template #filter="{ filterModel }">
                  <!-- <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999" /> -->
                  <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999" />

              </template>
            </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
  
<script>
//import { http } from "@/Services/Http";
import { http } from "@/services/Http";
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import moment from 'moment';
import Chart from 'primevue/chart';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { ref } from 'vue';
  // import 'moment-timezone';

  

  export default {
    components: {
      Chart,
      DataTable,
      Column
    },
    data() {
      return {
        chartData: { labels: [], datasets: [] },
        chartOptions: {
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';

                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(context.parsed.y);
                  }
                  return label;
                }
              }
            }
          }
        },
        emitidasinvData: null,   // Cambiado a emitidasinvData
        filtersEmitidasinv: null,
        tableCrecimiento: [],
        records: null, // Datos de la tabla EmitidasINV
        dt_emitidasinv,
        loading: true,
        ramosOptions: [],
        aseguradorasOptions: [],
        vendedoresOptions: [],
        clientesOptions: [],
        gruposOptions: [],
        filters: {
            ini: '',
            fin: '',
            ramo: '',
            aseguradora: '',
            vendedor: '',
            cliente: '',
            grupo: ''
        },
        tclientes2023: 0,
        tclientesHoy: 0,
        tclientesGanados: 0,
        tclientesPerdidos: 0,
        clientesGanados: [],
        clientesPerdidos: [],
        p23: 0,
        p24: 0,
        c1: 0,
        mp: 0,
        dp: 0,
        pn23: 0,
        pn24: 0,
        apn: 0,
        dpn: 0,
        mpn: 0,
        cpn: 0,
        valor2023: 0, 
        valor2024: 0,
      };
    },  
    methods: {
      formatCurrency(value) {
        return new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      },
      formatDate(date) {
        return moment(date).format('DD/MM/YYYY');
      },
      async loadRamos() {
          try {
              const response = await http().get("/ramosd");
              this.ramosOptions = [{ label: null, value: null }].concat(
                  response.data.map(ramo => ({ label: ramo, value: ramo }))
              );

          } catch (error) {
              console.error("Error fetching ramos:", error);
          }
      },
      async loadAseguradora() {
          try {
              const response = await http().get("/aseguradoras");
              this.aseguradorasOptions = [{ label: null, value: null }].concat(
                  response.data.map(aseguradora => ({ label: aseguradora, value: aseguradora }))
              );
          } catch (error) {
              console.error("Error fetching aseguradoras:", error);
          }
      },
      async loadVendedores() {
          try {
              const response = await http().get("/vendedores");
              this.vendedoresOptions = [{ label: null, value: null }].concat(
                  response.data.map(vendedor => ({ label: vendedor, value: vendedor }))
              );
          } catch (error) {
              console.error("Error fetching vendedores:", error);
          }
      },
      async loadClientes() {
          try {
              const response = await http().get("/clientes");
              this.clientesOptions = [{ label: null, value: null }].concat(
                  response.data.map(cliente => ({ label: cliente, value: cliente }))
              );

          } catch (error) {
              console.error("Error fetching clientes:", error);
          }
      },
      async loadGrupos() {
          try {
              const response = await http().get("/grupos");
              this.gruposOptions = [{ label: null, value: null }].concat(
                  response.data.map(grupo => ({ label: grupo, value: grupo }))
              );

          } catch (error) {
              console.error("Error fetching grupos:", error);
          }
      },
      async fetchData(filters = {}) {
        try {
            const formattedIni = this.filters.ini ? this.filters.ini.toISOString().split('T')[0] : null;
            const formattedFin = this.filters.fin ? this.filters.fin.toISOString().split('T')[0] : null;
            
            const params = {
              ini : formattedIni,
              fin : formattedFin,
              aseguradora: filters.aseguradora.value,
              vendedor: filters.vendedor.value,
              cliente: filters.cliente.value,
              grupo: filters.grupo.value,
              ramo: filters.ramo.value
            }


            const response = await http().get("/dashboard-data", { params });

            // Organiza los datos para la gráfica
            this.chartData = {
                labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],  // Añade todos los meses
                datasets: [
                {
                label: "PN TC 2023",
                backgroundColor: "#f87979",
                data: response.data.totalVentas2023
                },
                {
                label: "PN TC 2024",
                backgroundColor: "#7C8DFF",
                data: response.data.totalVentas2024
                }
            ]
            };

            // Organiza los datos para la tabla
            this.tableCrecimiento = []; // Limpia la tabla
            
            // Variables para guardar las sumas
            let sumValor2023 = 0;
            let sumValor2024 = 0;

            //RENOVACIONES
            let sumPol2023 = 0;
            let sumPol2024 = 0;
            let sumCan1 = 0;
            let sumCanTot = 0;
            
            
            // console.log("CanToti: ", response.data.CanT[0]);
            for(let i = 0; i < response.data.totalVentas2023.length; i++) {
              
              let valor2023 = response.data.totalVentas2023[i];
              let valor2024 = response.data.totalVentas2024[i];
              let crecimiento = ((valor2024 - valor2023) / valor2023) * 100;
              let meta = valor2023 * 1.3;
              let diferencia = valor2024-meta;

              // RENOVACIONES
              let pol2023 = parseInt(response.data.pol2023[i]); // Convertir a entero si es necesario
              let pol2024 = parseInt(response.data.pol2024[i]);
              let can1 = parseInt(response.data.Can1[i]); // Asegúrate de que can1 sea tratado como un número
              let canTot = parseInt(response.data.CanT[i]);
              
              // console.log("CanTot: ", canTot);
              let difR = pol2024 - pol2023;
              let metaRen = difR - can1;

              // Suma para el cálculo de totales
              sumValor2023 += Number(valor2023);
              sumValor2024 += Number(valor2024);
              //RENOVACIONES
              sumPol2023 += Number(pol2023);
              sumPol2024 += Number(pol2024);
              sumCan1 += Number(can1);
              sumCanTot += canTot;

              //console.log(sumPol2023);

              if (valor2023 !== 0 || valor2024 !== 0) {
                this.tableCrecimiento.push({
                    mes: this.chartData.labels[i],
                    valor2023: this.formatCurrency(valor2023), // Usamos la función para formatear el valor
                    valor2024: this.formatCurrency(valor2024), // Usamos la función para formatear el valor
                    crecimiento: crecimiento.toFixed(2) + '%', // Añadimos el símbolo de porcentaje
                    meta: this.formatCurrency(meta), // Usamos la función para formatear el valor
                    diferencia: this.formatCurrency(diferencia),

                    //RENOVACIONES
                    Pol2023: pol2023,
                    Pol2024: pol2024,
                    DifR: difR,
                    Can1: -can1,
                    MetaRen: metaRen, // Presentado como negativo
                    CanTot: -canTot
                });
              }
            }
            // console.log(sumValor2024);
            // Cálculo de totales
            let totalCrecimiento = ((sumValor2024 - sumValor2023) / sumValor2023) * 100;
            let totalMeta = sumValor2023 * 1.3;
            let diferenciaTotal = sumValor2024 - totalMeta;
            // RENOVACIONES
            let totalDifR = sumPol2024 - sumPol2023;
            let totalMetaRen = totalDifR - sumCan1;

            this.tableCrecimiento.push({
                mes: 'Total',
                valor2023: this.formatCurrency(sumValor2023),
                valor2024: this.formatCurrency(sumValor2024),
                crecimiento: totalCrecimiento.toFixed(2) + '%',
                meta: this.formatCurrency(totalMeta),
                diferencia: this.formatCurrency(diferenciaTotal),
                //RENOVACIONES
                Pol2023: sumPol2023,
                Pol2024: sumPol2024,
                DifR: totalDifR,
                Can1: -sumCan1,
                MetaRen: totalMetaRen, // Presentado como negativo
                CanTot: -sumCanTot
            });
            
            let t = this.tableCrecimiento.length -1;
            //this.pn23 = this.tableCrecimiento[t].valor2023;
            this.pn23 = sumValor2023;
            this.pn24 = sumValor2024;
            //this.pn24 = this.tableCrecimiento[t].valor2024;
            this.dpn = this.pn24-this.pn23;
            this.apn = this.tableCrecimiento[t].diferencia;
            //this.cpn = this.tableCrecimiento[t].crecimiento;
            this.cpn = totalCrecimiento.toFixed(2);
            this.mpn = totalMeta;
            this.p23 = this.tableCrecimiento[t].Pol2023;
            this.p24 = this.tableCrecimiento[t].Pol2024;
            this.dp = this.p24-this.p23;
            this.c1 = this.tableCrecimiento[t].Can1;
            this.mp = this.tableCrecimiento[t].MetaRen;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
      },
      async fetchDataEmitidasinv() {
        try {
            const response = await http().get("/emitidasinv-data");
            
            // this.records = response.data;

            this.records = response.data.map(record => {
            // record.fec_vig_de = new Date(record.fec_vig_de);
            // record.fec_vig_de = moment(record.fec_vig_de).format('DD/MM/YYYY');
            // record.fec_vig_de = moment(record.fec_vig_de, 'YYYY-MM-DD');
            // record.fec_vig_de = moment.utc(record.fec_vig_de).local().toDate();

            // const parts = record.fec_vig_de.split('-');
            // record.fec_vig_de = new Date(parts[0], parts[1] - 1, parts[2]);
              if (record.fec_vig_de) {
                // Utiliza la función formatDate para formatear las fechas
                record.fec_vig_de = this.formatDate(record.fec_vig_de);
              } 
              // if (record.fec_cancelacion === null) {
              //   // Si "Fec Cancelación" es nulo, establece un valor vacío
              //   record.fec_cancelacion = '';
              // } else {
              //   // Utiliza la función formatDate para formatear la columna "Fec Cancelación"
              //   record.fec_cancelacion = this.formatDate(record.fec_cancelacion);
              // }   
              if (record.fec_cancelacion) {
                record.fec_cancelacion = this.formatDate(record.fec_cancelacion);
              }          

              return record;
            });
            this.loading = false;

            // const datef = new Date("2024-11-01");
            // console.log(datef);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
      },
      clearFilter() {
          this.initFilters();
      },
      initFilters() {
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Asegura el formato MM
        this.filtersEmitidasinv = {
          global: { value: "/" + month + "/", matchMode: FilterMatchMode.CONTAINS },
          no_poliza: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
          fec_vig_de: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
          pn_tc: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
          cliente: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
          concepto: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
          vendedor: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
          grupo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
          ramo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
          aseguradora: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
          estatus_mov: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
          tipo_movimiento: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
          fec_cancelacion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
        };
      },
      applyFilters() {
        // Llama a fetchData con los filtros actuales
        this.fetchData(this.filters);
        this.fetchDataEmitidasinv(this.filters);
      },
      getStyleForDiferencia(value) {
        value = value.replace('$', ''); // Remueve el símbolo de porcentaje
        // console.log('el valor es:'+value);
        if (parseFloat(value) > 0) {
          return { color: 'blue' };
        } else if (parseFloat(value) < 0) {
          
          return { color: 'red' };
        }
        return {};
      },
      getStyleForDifR(value) {
        //value = value.replace('$', ''); // Remueve el símbolo de porcentaje
        // console.log('el valor es:'+value);
        if (parseFloat(value) > 0) {
          return { color: 'green' };
        } else if (parseFloat(value) < 0) {
          
          return { color: 'red' };
        }
        return {};
      },
      formatCrecimiento(value) {
        let floatValue = parseFloat(value);
        if (floatValue > 30) {
            return { 
                text: `😎${value}`, 
                style: { color: 'blue' }
            };
        } else if (floatValue < 0) {
            return { 
                text: `🙇🏻‍♂️${value}`, 
                style: { color: 'red' }
            };
        } else {
            return { 
                  text: `😎${value}`, 
                  style: { color: 'green' }
              };
        }
        //return { text: value, style: {}       };
      },
      formatMetaRen(value) {
        let floatValue = parseFloat(value);
        if (floatValue > 100) {
            return { 
                text: `😎${value}`, 
                style: { color: 'blue' }
            };
        } else if (floatValue < 0) {
            return { 
                text: `🙇🏻‍♂️${value}`, 
                style: { color: 'red' }
            };
        } else {
            return { 
                  text: `😎${value}`, 
                  style: { color: 'green' }
              };
        }
        //return { text: value, style: {} };
      },
      exportCSV() {
            // this.dt_emitidasinv.exportCSV();
            this.$refs.dt_emitidasinv.exportCSV();
            
      },
      async fetchDataC() {
        try {
          const res2023 = await http().get("/dashboard/clientes-2023");
          const resHoy = await http().get("/dashboard/clientes-hoy");
          const resGanados = await http().get("/dashboard/clientes-ganados");
          const resPerdidos = await http().get("/dashboard/clientes-perdidos");

          this.tclientes2023 = res2023.data.length;
          this.tclientesHoy = resHoy.data.length;
          this.tclientesGanados = resGanados.data.length;
          this.tclientesPerdidos = resPerdidos.data.length;
          this.clientesGanados = resGanados.data;
          this.clientesPerdidos = resPerdidos.data;
        } catch (error) {
          console.error("Hubo un error al obtener los datos del dashboard:", error);
        }
      },
      setInitialDates() {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Formatear las fechas a YYYY-MM-DD para que sean compatibles con input[type="date"]
        this.filters.ini = new Date(this.formatDateF(firstDayOfMonth));
        this.filters.fin = new Date(this.formatDateF(lastDayOfMonth));
        // this.filters.ini = new Date(firstDayOfMonth.getFullYear().toString(),firstDayOfMonth.getMonth().toString(),firstDayOfMonth.getDate().toString());
        // console.log(firstDayOfMonth.getFullYear().toString()+","+firstDayOfMonth.getMonth().toString());
      },
      formatDateF(date) {
        const year = date.getFullYear();
        // getMonth() devuelve un valor entre 0 y 11, por lo que se suma 1 para obtener el mes correcto
        // padStart(2, '0') asegura que el mes y el día sean de dos dígitos
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year},${month},${day}`;
      }
  },
  created() {
        this.initFilters();
  },
  mounted() {
    this.setInitialDates();
    this.fetchData(this.filters);
    this.fetchDataEmitidasinv(this.filters);
    this.loadRamos();
    this.loadAseguradora();
    this.loadVendedores();
    this.loadClientes();
    this.loadGrupos();
    this.fetchDataC();
  }
};

const dt_emitidasinv = ref();
/* const records = ref();

const exportCSV = () => {
    if (dt_emitidasinv.value && typeof dt_emitidasinv.value.exportCSV === 'function') {
        dt_emitidasinv.value.exportCSV({ fileName: 'emitidasinv_data.csv' });
    } else {
        console.error("El componente DataTable no está montado o no tiene un método exportCSV");
    }
}; */



</script>
  
<style scoped>
  .container {
    padding: 0 5px 0 15px;
  }

  .p-button {
    color: #081136 !important;
    border: 2px solid #D9D9D9 !important;
    background-color: #FFF;
    padding: 0.5rem !important;
    font-size: .8rem !important;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    border-radius: 10px;
  }

  .card {
    padding: 10px;
  }

  /* .card-element {
    padding-bottom: 3px;
  } */

  .p-button:enabled:hover {
    background-color: #FFF;
  }

  .p-inputtext {
    background: #fff;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    color: #4E556F;
    font-weight: 500;
    width: 100%;
  }

  .p-inputtext:enabled:focus:hover {
      border: none;
      box-shadow: none;
      border-color: transparent;
  }

  /* .text-500 {
    color: #081136 !important;
  } */

  /* .text-900 {
    color: #a1a1a1!important;
  } */
</style>
  