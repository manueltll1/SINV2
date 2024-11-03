<template>
    <Dialog v-model:visible="dialog" :modal="true" @show="adjustScroll" @hide="resetScroll" :style="{ width: '60vw', padding: '0'}" 
    :breakpoints="{ '960px': '75vw', '640px': '85vw', '400px': '95vw' }"
    :pt="dialogTokens" >
    <template #header>
        <Inplace :closable="true">
            <template #display>
                <span class="tarjeta-titulo font-bold" style="font-size: medium">
                    <i class="pi pi-briefcase"></i> {{ card.id }} - {{ card.titulo || 'Sin título' }}
                </span>
            </template>
            <template #content>
                <InputText 
                    :pt="dialogTokens"
                    id="titulo"
                    v-model.trim="card.titulo"
                    maxlength="150"
                    required
                    :class="['p-inputtext-header', { 'p-invalid': submitted && !card.titulo }]"
                    autofocus 
                />
            </template>
        </Inplace>
        <small class="p-error" v-if="submitted && !card.titulo">👈🏻 El título es requerido.</small>
        
        <div class="subtitle-card-wrapper">
            <p class="tarjeta-subtitulo-prioridad m-0" for="detalles">Prioridad</p>
            <div class="prioridad-rb">
                <div class="flex flex-wrap gap-1">
                    <div class="flex align-items-center">
                        <RadioButton 
                            :pt="dialogTokens"
                            v-model="card.prioridad" 
                            inputId="prioridadBaja" 
                            name="prioridad" 
                            value="Baja" 
                            class="baja-rb" 
                        />
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton 
                            :pt="dialogTokens"
                            v-model="card.prioridad" 
                            inputId="prioridadMedia" 
                            name="prioridad" 
                            value="Media" 
                            class="media-rb" 
                        />
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton 
                            :pt="dialogTokens"
                            v-model="card.prioridad" 
                            inputId="prioridadAlta" 
                            name="prioridad" 
                            value="Alta" 
                            class="alta-rb" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </template>
        <div class="subheader-card-wrapper w-full bg-gray-200 p-4">
            <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title" for="detalles">Tablero</span>
                </div>
                <div class="col-span-8 lg:col-span-2 xl:col-span-2 p-card-element">
                    <span class="tarjeta-subheader-title">{{ this.tableroNombre }}</span>
                </div>
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title">Columna</span>
                </div>
                <div class="col-span-8 lg:col-span-3 xl:col-span-3 p-card-element">
                    <ChangeColumn :card="card" :tablero_id="tablero_id" @datos="recibirValor"/>
                </div>
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title">Miembros</span>
                </div>
                <div class="col-span-4 lg:col-span-2 xl:col-span-2 p-card-element">
                    <Dropdown
                        v-model="selectedResponsableId"
                        :options="this.usuarios"
                        filter
                        optionValue="id"
                        optionLabel="name"
                        placeholder="Responsable"
                        class="w-full"
                    />
                </div>
                <div class="col-span-4 lg:col-span-2 xl:col-span-2 p-card-element">
                    <MultiSelect
                        v-model="this.card.observadores"
                        :options="this.usuarios"
                        optionLabel="iniciales"
                        filter
                        :filterFields="['name']"
                        display="chip"
                        placeholder="Observadores"
                        :maxSelectedLabels="3"
                        class="w-full"
                    >
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                        <template #footer>
                            <div class="py-2 px-4">
                                <b>{{ this.card.observadores ? this.card.observadores.length : 0 }}</b> item{{ (this.card.observadores ? this.card.observadores.length : 0) > 1 ? 's' : '' }} selected.
                            </div>
                        </template>
                    </MultiSelect>
                </div>
            </div>
        </div>
        <div class="card-container">
            <!-- <p>{{ card }}</p> -->
            <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title">Categoría</span>
                </div>
                <div class="col-span-8 lg:col-span-2 xl:col-span-2 p-card-element">
                    <Select
                        v-model="this.card.categoria_id"
                        :options="this.categorias_select"
                        filter
                        placeholder="Seleccione"
                        optionValue="id"
                        optionLabel="nombre"
                        class="w-full"
                        :class="{'p-invalid': submitted && !card.categoria_id}"
                    />
                </div>
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title">Ramo</span>
                </div>
                <div class="col-span-8 lg:col-span-2 xl:col-span-2 p-card-element">
                    <Select
                        v-model="this.card.ramo_id"
                        :options="this.ramos"
                        filter
                        placeholder="Seleccione"
                        optionValue="id"
                        optionLabel="nombre"
                        class="w-full"
                        @change="getSubramos"
                    />
                </div>
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title">Subramo</span>
                </div>
                <div class="col-span-8 lg:col-span-2 xl:col-span-2 p-card-element">
                    <Select
                        v-model="this.card.subramo_id"
                        :options="this.subramos"
                        filter
                        placeholder="Seleccione"
                        optionValue="id"
                        optionLabel="nombre"
                        class="w-full"
                    />
                </div>
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title">Compañía</span>
                </div>
                <div class="col-span-8 lg:col-span-2 xl:col-span-2 p-card-element">
                    <MultiSelect
                        v-model="this.card.cias"
                        :options="this.cias"
                        optionLabel="iniciales"
                        filter
                        :filterFields="['nombre']"
                        display="chip"
                        placeholder="Seleccione"
                        :maxSelectedLabels="3"
                        class="w-full"
                    >
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ slotProps.option.nombre }}</div>
                            </div>
                        </template>
                        <template #footer>
                            <div class="py-2 px-4">
                                <b>{{ this.card.cias ? this.card.cias.length : 0 }}</b> item{{ (this.card.cias ? this.card.cias.length : 0) > 1 ? 's' : '' }} selected.
                            </div>
                        </template>
                    </MultiSelect>
                </div>
            </div>
        </div>
        <div class="card-container">
            <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title">Cliente</span>
                </div>
                <div class="col-span-8 lg:col-span-4 xl:col-span-4 p-card-element">
                    <AutoComplete
                        v-model="selectedCliente"
                        :suggestions="filteredClientes"
                        @complete="searchClientes"
                        field="nombreCompleto"
                        class="tarjeta-subheader-value w-full"
                        placeholder="Seleccione"
                        @change="onClienteSelected"
                    />
                </div>
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title">Póliza</span>
                </div>
                <div class="col-span-8 lg:col-span-2 xl:col-span-2 p-card-element">
                    <AutoComplete
                        v-model="selectedPoliza"
                        :suggestions="filteredPolizas"
                        @complete="searchPolizas"
                        field="no_poliza"
                        class="tarjeta-subheader-value w-full"
                        placeholder="Seleccione"
                        @change="onPolizaSelected"
                    >
                        <template #option="slotProps">
                            <div>
                            {{ slotProps.option.no_poliza.replace(/\s+/g, '') }} - {{ slotProps.option.concepto }}
                            </div>
                        </template>
                    </Autocomplete>
                </div>
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title">Vendedor</span>
                </div>
                <div class="col-span-8 lg:col-span-3 xl:col-span-3 p-card-element">
                    <AutoComplete
                        v-model="selectedVendedor"
                        :suggestions="filteredVendedor"
                        @complete="searchVendedor"
                        field="nombre"
                        class="tarjeta-subheader-value w-full"
                        placeholder="Seleccione"
                    />
                </div>
            </div>
        </div>
        <div class="card-container" v-if="this.tipoTablero.includes('Prospección')">
            <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-4 lg:col-span-1 xl:col-span-1 p-card-element">
                    <span class="tarjeta-subheader-title">Conducto</span>
                </div>
                <div class="col-span-8 lg:col-span-4 xl:col-span-4 p-card-element">
                    <div>
                        <Select
                            v-model="card.conducto"
                            :options="conductosTarjeta"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Seleccione"
                            class="md:w-15rem"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="card-container">
            <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-6 lg:col-span-3 xl:col-span-3 p-card-element">
                    <p class="tarjeta-date-subheader-title" for="detalles">Fecha Inicio</p>
                    <Button :pt="dialogTokens"  @click="mostrarDatepickerioInicio" :class="['w-full', this.overdue(tarjeta.fecha_inicio)]" :label=fecha_inicio icon="pi pi-calendar" text />
                    <div class="calendar-wrapper">
                        <Datepicker v-model="card.fechainicio" @date-select="onDateInicio" :showIcon="false" :showOnFocus="false" :inline="true" :minDate="minDate" v-if="mostrar_inicio" dateFormat="yy-mm-dd"  showTime/>
                    </div>
                </div>
                <div class="col-span-6 lg:col-span-3 xl:col-span-3 p-card-element">
                    <p class="tarjeta-date-subheader-title" for="detalles">Fecha Compromiso</p>
                    <Button :pt="dialogTokens"  @click="mostrarDatepickerioCompromiso" :class="['w-full', this.overdue(tarjeta.fecha_compromiso)]" :label=fecha_compromiso icon="pi pi-calendar" text  :disabled=compromiso_disabled  />
                    <div class="calendar-wrapper">
                        <Datepicker v-model="card.fechacompromiso" @date-select="onDateCompromiso" :showIcon="false" :showOnFocus="false" :inline="true" :minDate=card.fechainicio v-if="mostrar_compromiso" dateFormat="yy-mm-dd" showTime :disabled=compromiso_disabled />
                    </div>
                </div>
                <div class="col-span-6 lg:col-span-3 xl:col-span-3 p-card-element">
                    <p class="tarjeta-date-subheader-title" for="detalles">Fecha Recordatorio</p>
                    <Button :pt="dialogTokens"  :class="['w-full', this.overdue(tarjeta.fecha_recordatorio)]" :label="card.fecha_recordatorio ? card.fecha_recordatorio : '-'" icon="pi pi-calendar" text :disabled=true  />
                </div>
                <div class="col-span-6 lg:col-span-3 xl:col-span-3 p-card-element">
                    <p class="tarjeta-date-subheader-title" for="detalles">&nbsp;</p>
                    <RecordatorioTarjeta :tarjeta="tarjeta" />
                </div>
            </div>
        </div>
        <div class="grid-container">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 lg:col-span-7 xl:col-span-7">
                    <div class="tarjeta-container checklist-container">
                        <div class="col-span-12 p-fluid">
                            <p class="tarjeta-subtitulo" for="detalles"><i class="pi pi-align-justify"></i> Descripción de Tarea</p>
                            <div class="card-description">
                                <Textarea id="detalles" v-model="card.descripcion" autoResize class="w-full" :class="{'p-invalid': submitted && !card.descripcion}" rows="1"/>
                            </div>
                        </div>
                    </div>
                    <!-- add Checklist -->
                </div>
                <div class="col-span-12 lg:col-span-5 xl:col-span-5">
                    <div class="tarjeta-container checklist-container">
                        <div class="col-span-12 p-fluid">
                            <div class="agregar-tarea-wrapper pt-0">
                                <span for="task" class="tarjeta-subtitulo mt-3 lh-2 pr-5"><i class="pi pi-folder-plus"></i> Archivos Adjuntos </span>
                                <Button :pt="dialogTokens"  label="" icon="pi pi-plus pt-10" text />
                            </div>
                        </div>
                        <div class="adjuntos-block">
                            <!-- <div class="attachment-container">
                                <div class="flex">
                                    <div class="flex attachment-icon">
                                        <i class="pi pi-file"></i>
                                    </div>
                                    <div class="flex">
                                        <p class="tarjeta-subtitulo" for="detalles"> Número de serie Toyota
                                            Ana Morales Hernández</p>
                                    </div>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-7 xl:col-span-7">
                    <div class="tarjeta-container checklist-container">
                        <div class="agregar-tarea-wrapper">
                            <span for="task" class="tarjeta-subtitulo mt-3 lh-2 pr-10"><i class="pi pi-check-square"></i> Tareas </span>
                            <Button :pt="dialogTokens"  label="" icon="pi pi-plus pt-10" text @click="toggleShowAddTask"/>
                        </div>
                        <div class="tasks-block">
                            <div class="col-span-12">
                                <CheckList :checklists="checklists_tarjeta"/>
                            </div>
                        </div>
                    </div>
                    <!-- add Checklist -->
                </div>
                <div class="col-span-12 lg:col-span-5 xl:col-span-5">
                    <div class="tarjeta-container checklist-container ">
                        <p class="tarjeta-subtitulo mt-3 lh-2 pr-10" for="detalles"><i class="pi pi-history"></i> Bitácora</p>
                        <!-- Bitacoras-->
                        <div class="bitacora-block">
                            <Bitacora :tarjeta="card" :submittedComentario="submittedComentario" />
                        </div>
                        <div class="add-comment-block">
                            <div class="grid grid-cols-12 gap-1">
                                <div class="col-span-11">
                                    <Textarea v-model="comentario" class="w-full" placeholder="Agregar comentario" autoResize rows="1"/>
                                </div>
                                <div class="col-span-1 p-0">
                                    <Button :pt="dialogTokens"  :disabled="comentario.length > 500" class="full-width" label=" " icon="pi pi-send" text @click="addBitacora()" />
                                </div>
                            </div>
                            <span class="flex flex-column md:align-items-end font-medium text-secondary text-sm" :class="{'text-red-500': comentario.length > 500}">{{ comentario.length }} / 500</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Popover ref="showresponsable">
            <div>
                <div>
                    <p class="tarjeta-subtitulo mb-3" for="detalles"><i class="pi pi-user"></i> Asignar a</p>
                    <div class="mb-3">

                    </div>
                    <p class="tarjeta-subtitulo mb-3" for="detalles"><i class="pi pi-users"></i> Asignar Observador(es)</p>
                    <div v-if="selectedObservadors !== null" class="mb-3">

                    </div>
                </div>
            </div>
        </Popover>
        <Popover ref="showaddtask">
            <div>
                <div>
                    <p class="tarjeta-subtitulo mb-3" for="checklist_id"><i class="pi pi-check"></i> Agregar Checklist</p>
                </div>
                <div class="mb-3">
                    <p>Titulo de checklist(s)</p>
                    <Textarea v-model="task" rows="1" autoResize autocomplete="off" placeholder="Puedes agregar varios checklist, uno por línea"/>
                </div>
                <div>
                    <Button :pt="dialogTokens"  icon="pi pi-plus" class="w-full" label="Crear nuevo checklist(s)" severity="danger"  @click="addTask()" link />
                </div>
                <div class="mb-3">
                    <Button :pt="dialogTokens"  icon="pi pi-list" class="w-full" label="Agregar a checklist" @click="toggle" text  severity="info" />
                </div>
            </div>
        </Popover>
        <template #footer>
            <Button v-if="can('tarjetas.destroy') && card.id" class="button-footer" label="Eliminar" icon="pi pi-trash" iconPos="left" text @click="confirmDeleteTarjeta(tarjeta)" />
            <Button v-if="can('tarjetas.clonar') && card.id" class="button-footer" label="Clonar" icon="pi pi-copy" iconPos="left" text @click="toggleClonar" />
            <Button v-if="can('tarjetas.bloquear') && card.id" class="button-footer" :label="label_bloqueo" icon="pi pi-lock" iconPos="left" text @click="toggleBloquear" />
            <Button class="button-footer" label="Cancelar" icon="pi pi-times" iconPos="left" text @click="hideDialogTarjeta" />
            <Button class="button-footer" label="Guardar" icon="pi pi-save" iconPos="left" text @click="handleSubmit" />
        </template>

    </Dialog>
    <Popover ref="op">
        <div class="flex flex-column gap-3 w-25rem">
            <div class="field">
                <Select v-model="checklist" :options="checklists" optionLabel="nombre" optionValue="id" placeholder="Selecciona checklist" />
            </div>
            <div>
                <Button :pt="dialogTokens"  v-if="can('itemstarjeta.import')" label="Agregar" :disabled="!formularioChecklistValido" icon="pi pi-plus" text @click="addChecklist" />
            </div>
        </div>
    </Popover>
    <Popover ref="bloquear" :showCloseIcon=true>
        <div class="flex flex-column gap-3 w-50rem">
            <span class="p-float-label">
                <Textarea v-model="motivo" autocomplete="off" :class="{'p-invalid': submitted && !motivo}" rows="1" autoResize />
                <label for="task">Motivo</label>
            </span>
            <small class="p-error" v-if="submitted && !motivo">El motivo es requerido.</small><br/>
        </div>

        <div>
            <Button :pt="dialogTokens"  label="Guardar" text @click="bloqueo()" />
        </div>
    </Popover>
    <Popover ref="clonar" :showCloseIcon=true>
        <p class="tarjeta-subtitulo mb-3" for="tablero"><i class="pi pi-users"></i> Seleccione el tablero</p>
        <div v-if="selectedObservadors !== null" class="mb-3">
        <Select
            v-model=this.tablero
            :options="tableros"
            filter
            optionValue="id"
            optionLabel="nombre"
            class="w-full md:w-14rem"
            @change="getCategoriasClonar"
        />
        </div>
        <div>
        <p class="tarjeta-subtitulo mb-3" for="categoria_nombre"><i class="pi pi-tag"></i> Categoría</p>
        </div>
        <div class="mb-3">
            <Select
                v-model="this.clonar.categoria_id"
                :options="this.categorias_clonar"
                filter
                optionValue="id"
                optionLabel="nombre"
                class="w-full"
            />
        </div>
        <div>
        <p class="tarjeta-subtitulo mb-3" for="ramo_id"><i class="pi pi-tag"></i> Ramo </p>
        </div>
        <div class="mb-3">
            <Select
                v-model="this.clonar.ramo_id"
                :options="this.ramos_clonar"
                filter
                optionValue="id"
                optionLabel="nombre"
                class="w-full"
                @change="getSubramosClonar"
            />
        </div>
        <div>
        <p class="tarjeta-subtitulo mb-3" for="subramo_id"><i class="pi pi-tag"></i> Subramo </p>
        </div>
        <div class="mb-3">
            <Select
                v-model="this.clonar.subramo_id"
                :options="this.subramos_clonar"
                filter
                optionValue="id"
                optionLabel="nombre"
                class="w-full"
            />
        </div>
        <div>
            <Button :pt="dialogTokens"  label="Guardar" text @click="clonarTarjeta()" />
        </div>
    </Popover>
    <Dialog v-model:visible="deleteDialogTarjeta" :style="{width: '450px'}"  :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="tarjeta">Realmente desea eliminar la tarjeta <b>{{card.titulo}}</b>?</span>
        </div>
        <template #footer>
            <Button :pt="dialogTokens"  label="No" icon="pi pi-times" text @click="deleteDialogTarjeta = false"/>
            <Button :pt="dialogTokens"  label="Si" icon="pi pi-check" text @click="deleteTarjeta" />
        </template>
    </Dialog>
</template>

<script>
import { sendRequest, sendRequestList, userCan } from '@/helper';
import moment from 'moment';
import Bitacora from "./BitacoraTarjeta.vue";
import ChangeColumn from './ChangeColumn.vue';
import CheckList from './CheckList.vue';
import RecordatorioTarjeta from './RecordatorioTarjeta.vue';

const url = import.meta.env.VITE_APP_BASE_URL;
export default {
    emits: ['datos'],
    components: {
      CheckList,
      Bitacora,
      ChangeColumn,
      RecordatorioTarjeta
    },
    props: {
        tarjeta: {
            type: Object,
            required: true
        },
        tablero_id: {
            type: String,
            required: true
        },
        tarjetaDialog: {
            type: Boolean,
            required: true
        }
    },
    data(){
        return{
            submitted: false,
            dialog: false,
            card: {},
            categorias: null,
            checklists: null,
            checklist: null,
            tipoTablero: "",
            tableroNombre: "",
            mostrar_inicio: false,
            mostrar_compromiso: false,
            compromiso_disabled: false,
            filtered: null,
            filterType: "",
            usuarios: null,
            checklists_tarjeta: [],
            submittedComentario: false,
            comentario: "",
            task: "",
            tasks: [],
            conductosTarjeta: null,
            label_bloqueo: "",
            icon_bloqueo: "",
            tablero_nombre: "",
            motivo: null,
            deleteDialogTarjeta: false,
            clonarDialogTarjeta: false,
            filteredUsers: [],
            selectedObservadors: null,
            selectedResponsableId: null,
            selectedResponsable: null,
            selectedClienteId: null,
            selectedCliente: null,
            selectedPolizaId: null,
            selectedPoliza: null,
            selectedVendedor: [],
            filteredClientes: [],
            filteredPolizas: [],
            filteredVendedor: [],
            fecha_inicio: "",
            fecha_compromiso: "",
            minDate: null,
            categorias_select: null,
            quattro_vendedor: null,
            ramos: null,
            subramos: null,
            tableros: null,
            tablero: null,
            categorias_clonar: null,
            ramos_clonar: null,
            subramos_clonar: null,
            clonar: {},
            cias: [],
            dialog: false,
            // dialogTokens1: {
            //     root: {
            //         class: 'custom-dialog', // Asigna una clase solo a este diálogo
            //         style: {
            //             '--p-dialog-background': 'white',
            //             '--p-dialog-color': 'white',
            //             '--p-dialog-title-font-size': '1.25rem',
            //             '--p-dialog-title-font-weight': '700',
            //             '--p-dialog-header-padding': '10px',
            //             '--p-dialog-border-radius': '8px',
            //         }
            //     },
            //     header: {
            //         style: {
            //             background: '#4E556F',
            //             paddingTop: '1rem',
            //             paddingBottom: '1rem',
            //             color: '#ffffff',
            //             borderRadius: '8px 8px 0 0'
            //         }
            //     },
            // },
            dialogTokens: {
                root: {
                    style: {
                        background: '#FFFFFF',  // Fondo del diálogo
                        borderRadius: '8px 8px', // Bordes redondeados para el diálogo  
                        '--p-dialog-content-padding': '0rem',

                    }
                },
                header: {
                    style: {
                        background: '#4E556F',
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                        color: '#ffffff',
                        borderRadius: '8px 8px 0 0'
                    },
                },
                footer: {
                    style: {
                        // background: '#4E556F',
                    },
                },
                // input: {
                //     class: 'p-inputtext',
                //     style: {
                //         background: 'none',  // Fondo transparente en los campos de entrada
                //         color: '#4E556F',  // Color del texto en los campos de entrada
                //         padding: '5px 0',  // Espaciado interno en los campos de entrada
                //         fontWeight: '500',  // Grosor del texto en los campos de entrada
                //         width: '100%',  // Asegura que los campos de entrada sean de ancho completo
                //     }
                // },
                // button: {
                //     class: 'p-button',
                //     style: {
                //         color: '#081136',  // Color del texto de los botones
                //         border: '2px solid #D9D9D9',  // Color del borde del botón
                //         // padding: '0.5rem 0',  // Padding interno del botón
                //         fontSize: '.8rem',  // Tamaño de fuente del botón
                //         borderRadius: '10px',  // Bordes redondeados de los botones
                //     }
                // },
                // radiobutton: {
                //     class: 'p-radiobutton',
                //     style: {
                //         width: '15px',  // Tamaño del RadioButton
                //         height: '15px',
                //         borderColor: 'red'  // Altura del RadioButton
                //     }
                // },
                // altaRadio: {
                //     class: 'alta-rb',
                //     style: {
                //         borderColor: '#E20613',  // Borde del RadioButton de alta prioridad
                //         backgroundColor: '#E20613',  // Fondo del RadioButton de alta prioridad
                //         borderRadius: '5px',
                //     }
                // },
                // mediaRadio: {
                //     class: 'media-rb',
                //     style: {
                //         borderColor: '#F29100',  // Borde del RadioButton de media prioridad
                //         backgroundColor: '#F29100',  // Fondo del RadioButton de media prioridad
                //         borderRadius: '5px',
                //     }
                // },
                // bajaRadio: {
                //     class: 'baja-rb',
                //     style: {
                //         borderColor: '#009540',  // Borde del RadioButton de baja prioridad
                //         backgroundColor: '#009540',  // Fondo del RadioButton de baja prioridad
                //         borderRadius: '5px',
                //     }
                // },
                // multiselect: {
                //     class: 'p-multiselect',
                //     style: {
                //         padding: '0.4rem 0',  // Padding en la etiqueta del MultiSelect
                //         color: '#4E556F',  // Color de la etiqueta
                //         fontWeight: '500',  // Peso de la fuente en la etiqueta del MultiSelect
                //     }
                // },
                // multiselectChip: {
                //     class: 'p-multiselect-chip',
                //     style: {
                //         padding: '0.4rem 0',  // Padding de los chips en el MultiSelect
                //         color: '#4E556F',  // Color del texto en los chips
                //         fontWeight: '500',  // Peso de la fuente en los chips
                //     }
                // },
                // select: {
                //     class: 'p-select',
                //     style: {
                //         display: 'none',  // Oculta el ícono del trigger
                //         padding: '5px 1px',  // Padding en la etiqueta del select
                //     }
                // },
                // calendar: {
                //     class: 'p-calendar',
                //     style: {
                //         position: 'absolute',  // Posiciona el calendario de manera absoluta
                //     }
                // },
                // datepicker: {
                //     class: 'p-datepicker',
                //     style: {
                //         thPadding: '0',  // Padding de los encabezados de la tabla de fechas
                //         tdPadding: '0',  // Padding de los días en la tabla de fechas
                //     }
                // }
            }
        }
    },
    methods: {
        adjustScroll() {
            const maxScrollRight = document.documentElement.scrollWidth - window.innerWidth;
            window.scrollTo({ left: maxScrollRight, behavior: 'auto' });
        },
        resetScroll() {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            this.$emit('datos', { visible: false });
            this.hideDialogTarjeta();
        },
        async getCategorias() {
            const tablero_id = this.tablero_id;
            this.loading = true;
            const result = await sendRequestList(url+"/categoriaslist?tablero="+tablero_id);
            this.categorias = result.data.data;
            this.loading = true;
        },
        async getGroupcategorias() {
            const tablero_id = this.tablero_id;
            this.loading = true;
            const result = await sendRequestList(url+"/categoriaselect?tablero="+tablero_id);
            this.categorias_select = result.data;
            this.loading = false;
        },
        async getRamos() {
            this.loading = true;
            const result = await sendRequestList(url+"/ramosselect");
            this.ramos = result.data.data;
            this.loading = false;
        },
        async getSubramos() {
            const ramo = this.card.ramo_id;
            this.loading = true;
            const result = await sendRequestList(url+"/subramosselect?ramo="+ramo);
            this.subramos = result.data.data;
            this.loading = false;
        },
        async getCategoriasClonar() {
            const tablero_id = this.tablero;
            const result = await sendRequestList(url+"/categoriaselect?tablero="+tablero_id);
            this.categorias_clonar = result.data;
        },
        async getRamosClonar() {
            const result = await sendRequestList(url+"/ramosselect");
            this.ramos_clonar = result.data.data;
        },
        async getSubramosClonar() {
            const result = await sendRequestList(url+"/subramosselect?ramo="+this.clonar.ramo_id);
            this.subramos_clonar = result.data.data;
        },
        async getChecklists() {
            this.loading = true;
            const result = await sendRequestList(url+"/checklist");
            this.checklists = result.data.data;
            this.checklist = null;
        },
        watchCategoria() {
            const categoria = this.buscarCategoriaId(this.card.categoria_id);
            if (categoria && categoria.tiempo_respuesta != null) {
                this.calculaFechaCompromiso(categoria.tiempo_respuesta, categoria.unidad_tiempo);
                this.compromiso_disabled = true;
            } else {
                this.compromiso_disabled = false;
            }
        },
        async getTipoTablero() {
            const result = await sendRequest('GET', {},url+"/tableros/"+this.tablero_id, true);
            const tablero = {...result.data};
            this.tipoTablero = tablero.nombres_categorias;
            this.tableroNombre = tablero.nombre;
        },
        async getTableros(){
          const result = await sendRequestList(url+"/tableroslist");
          this.tableros = result.data.data;
        },
        async getConductosTarjeta(){
            this.loading = true;
            const result = await sendRequestList(url+"/conductostarjetas");
            this.conductosTarjeta = result.data;
        },
        onDateInicio() {
            this.fecha_inicio = this.fechaFormateada(this.card.fechainicio);
            this.mostrar_inicio = false;

            if(this.card.categoria_id) {
                this.watchCategoria();
            }
        },
        mostrarDatepickerioInicio() {
            this.mostrar_inicio = !this.mostrar_inicio;
            if (this.mostrar_inicio == true && this.mostrar_compromiso == true) {
                this.mostrar_compromiso= false;
            }
        },
        buscarCategoriaId(id) {
            const categoria_id = parseInt(id);
            if (this.categorias) {
                return this.categorias.find(objeto => objeto.id === categoria_id);
            }
            return {};
        },
        calculaFechaCompromiso(valor, unidad ) {
            const fecha = new Date(this.card.fechainicio);
            switch (unidad) {
            case "minutos":
                fecha.setMinutes(fecha.getMinutes() + valor);
                break;
            case "horas":
                fecha.setHours(fecha.getHours() + valor);
                break;
            case "días":
                fecha.setDate(fecha.getDate() + valor);
                break;
            case "semanas":
                fecha.setDate(fecha.getDate() + (valor * 7));
                break;
            case "meses":
                fecha.setMonth(fecha.getMonth() + valor);
                break;
            default:
                break;
            }

            this.card.fechacompromiso = fecha;
            this.fecha_compromiso = this.fechaFormateada(this.card.fechacompromiso);
        },
        onDateCompromiso() {
            this.fecha_compromiso = this.fechaFormateada(this.card.fechacompromiso);
            this.mostrar_compromiso = false;
        },
        mostrarDatepickerioCompromiso() {
            this.mostrar_compromiso = !this.mostrar_compromiso;
            if (this.mostrar_inicio == true && this.mostrar_compromiso == true) {
                this.mostrar_inicio= false;
            }
        },
        search(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    this.filtered = [...this.usuarios];
                } else {
                    this.filtered = this.usuarios.filter((user) => {
                        return user.name.toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }, 250);
        },
        can(action) {
            return userCan(action);
        },
        hideDialogTarjeta() {
            this.dialog = false;
            this.submitted = false;
            this.card = {};
            this.checklists_tarjeta= [];
            this.filteredUsers= [];
            this.selectedObservadors= [];
            this.selectedResponsableId= null;
            this.selectedResponsable= null;
            this.selectedClienteId= null;
            this.selectedCliente= null;
            this.selectedPolizaId= null;
            this.selectedPoliza= null;
            this.selectedVendedor = [];
            this.comentario='';
            this.task='';
        },
        async handleSubmit() {
            this.submitted = true; // Marca que se ha intentado enviar el formulario

            if (this.formularioValido) {                 
                await this.saveTarjeta(false); // Envía la tarjeta si es válida
            }
        },
        async saveTarjeta(close = false) {
            this.submitted = true;
            var message = "";
            var result = "";
            var fecha_inicio = "";
            var fecha_compromiso = "";

            if (this.card.fechainicio != null) {
                fecha_inicio = this.fechaFormateada(this.card.fechainicio);

                if (this.card.fechacompromiso != null && this.card.fechainicio.getTime() > this.card.fechacompromiso.getTime()) {
                    this.card.fechacompromiso = this.card.fechainicio;
                }
            }

            if (this.card.fechacompromiso != null) {
                fecha_compromiso = this.fechaFormateada(this.card.fechacompromiso);
            }
            var observadores = [];
            if(this.card.observadores) {
                this.card.observadores.forEach(
                    user => observadores.push(user.id)
                )
            }

            var cias = [];
            if(this.card.cias) {
                this.card.cias.forEach(
                    cia => cias.push(cia.id)
                )
            }

            var params = {
                titulo: this.card.titulo.trim(),
                descripcion: this.card.descripcion,
                posicionColumna: 1,
                prioridad: this.card.prioridad,
                nivel: 0,
                conducto: this.card.conducto,
                estatus: "activa",
                categoria_id: this.card.categoria_id,
                tablero_id: this.tablero_id,
                responsable: this.selectedResponsableId,
                observadores: observadores,
                cliente_id: this.selectedClienteId,
                poliza_id: this.selectedPolizaId,
                fecha_inicio: fecha_inicio,
                fecha_compromiso: fecha_compromiso,
                subramo_id: this.card.subramo_id,
                ramo_id: this.card.ramo_id,
                vendedor_id: this.selectedVendedor ? this.selectedVendedor.id : null,
                cias: cias
            };

            if(this.card.id) {
                params.nivel = this.card.nivel;
                params.estatus = this.card.estatus;
                message = "Tarjeta actualizada";
                result = await sendRequest(
                    "PUT",
                    params,
                    url+"/tarjetas/"+this.card.id,
                    true
                );
            } else {
                message = "Tarjeta registrada";
                result = await sendRequest(
                    "POST",
                    params,
                    url+"/tarjetas",
                    true
                );
            }

            if (result.data) {
                this.$toast.add({severity:'success', summary: 'Éxito', detail: message, life: 3000});
                if (close) {
                    this.checklists_tarjeta= [];
                    this.hideDialogTarjeta();
                } else {
                    this.card = {...result.data};
                    this.getChecklistsTarjeta(this.card.id);
                    this.change_labels_bloqueo();
                }
            } else {
                this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
            }
        },
        overdue(fecha) {
          const formato = 'DD/MM/YYYY HH:mm';
          const fechaActual = moment();
          const fechaEntrada = moment(fecha, formato);

          if (!fechaEntrada.isValid()) {
            // Maneja el caso de una fecha no válida
            return 'gray';
          }

          const diferencia = fechaEntrada.diff(fechaActual, 'days', true);

          if (diferencia < 0) {
            return 'overdue-0';
          } else if (diferencia <= 1) {
            return 'overdue-1';
          } else {
            return '';
          }

        },
        change_labels_bloqueo() {
            if (this.card.estatus == "activa") {
                this.label_bloqueo = "Bloquear";
                this.icon_bloqueo="pi pi-ban";
            }

            if (this.card.estatus == "bloqueada") {
                this.label_bloqueo = "Desbloquear";
                this.icon_bloqueo="pi pi-unlock";
            }
        },
        async bloqueo() {
            this.submitted = true;
            this.submittedComentario = false;
            if (this.motivo && this.motivo.trim() !== '') {
                var des_bloqueo = "";
                if (this.label_bloqueo == "Bloquear") {
                    des_bloqueo = "Bloqueo: ";
                } else {
                    des_bloqueo = "Desbloqueo: ";
                }
                const params = {
                    descripcion: des_bloqueo+this.motivo,
                    tarjeta_id: this.card.id,
                };
                var error = false;

                const result = await sendRequest("POST", params, url+"/bitacoras");
                this.submittedComentario = true;
                if (result == "ok") {
                    const tarjeta = await sendRequest("PUT", {}, url+"/bloqueartarjeta/"+this.card.id, true);

                    if (tarjeta.data) {
                        this.motivo = "";
                        this.submitted = false;
                        this.$refs.bloquear.hide();
                        this.card.estatus = tarjeta.data.estatus;
                        this.change_labels_bloqueo();
                    } else {
                        error = true;
                    }
                } else {
                    error = true;
                }

                if (error == true) {
                    this.$toast.add({severity:'error', summary: 'Error', detail: "Error al guardar el motivo", life: 3000});
                }
            }
        } ,
        toggle(event) {
            this.$refs.op.toggle(event);
        },
        toggleAddTask(event) {
            this.$refs.addtask.toggle(event);
        },
        toggleShowResponsable(event) {
            this.$refs.showresponsable.toggle(event);
        },
        toggleShowAddTask(event) {
            this.$refs.showaddtask.toggle(event);
        },
        toggleBloquear(event) {
            this.$refs.bloquear.toggle(event);
        },
        async toggleClonar(event) {
            this.$refs.clonar.toggle(event);
            this.getTableros();
            this.getRamosClonar();
            this.tablero = this.tablero_id;
            this.clonar = {};
        },
        async addTask() {
            if (!this.card.id) { // si la tarjeta no esta guardada, primero se guarda la tarjeta y se asigna el card.id para poder relacionar a un checklist
                this.handleSubmit();
            }

            if (this.task.length > 0 && this.card.id) {
                if (this.task.includes('\n')) {
                    const lineas = this.task.split('\n');
                    const lineasFiltradas = lineas.filter(linea => linea.trim() !== '');

                    lineasFiltradas.forEach((elemento) => {
                    this.tasks.push({ nombre: elemento});
                    });
                } else {
                    this.tasks.push({ nombre: this.task});
                }

                const params = {
                    tarjeta_id: this.card.id,
                    activa: 1,
                    tipo: "tarjeta",
                    items: this.tasks
                };

                const result = await sendRequest("POST", params, url+"/itemstarjeta");
                if (result == "ok") {
                    this.tasks = [];
                    this.task = "";
                    this.getChecklistsTarjeta(this.card.id);
                } else {
                    this.$toast.add({severity:'error', summary: 'Error', detail: "Error al guardar la checklist", life: 3000});
                }
            }

        },
        async getUsuarios(){
            this.loading = true;
            const result = await sendRequestList(url+"/userslist");
            this.usuarios = result.data.data;
            this.selectedResponsable = this.usuarios[this.card.responsable];
            this.loading = false;
        },
        async getCias(){
            this.loading = true;
            const result = await sendRequestList(url+"/cialist");
            this.cias = result.data.data;
            this.loading = false;
        },
        async getCliente(clienteid){
            this.loading = true;
            const result = await sendRequestList(url+"/quattro_clientes/"+clienteid);
            const cliente = result.data;
            this.selectedCliente = {
                ...cliente,
                nombreCompleto: `${cliente.nombre} ${cliente.ap_pat} ${cliente.ap_mat}`
            };
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
            this.selectedCliente = cliente.value;
            this.selectedClienteId = cliente.value.id;
        },
        async getPoliza(polizaid){
            this.loading = true;
            const result = await sendRequestList(url+"/quattro_polizas/"+polizaid);
            this.selectedPoliza = result.data;
        },
        async getVendedor(vendedor_id) {
            this.loading = true;
            const result = await sendRequestList(url + "/showvendedor/" + vendedor_id);
            if (result.data.data) {
                const persona = result.data.data;

                // Verificar si tiene razón social (persona moral)
                const fullName = [persona.nombres, persona.paterno, persona.materno]
                    .filter(Boolean) // Filtrar los valores null o undefined
                    .join(" "); // Unir con espacios

                // Si tiene razón social, mostrarla; de lo contrario, mostrar nombre completo
                const displayName = persona.razon_social || fullName;

                // Asignar el vendedor seleccionado con el nombre adecuado
                this.selectedVendedor = {
                    id: persona.vendedor[0].id,
                    nombre: displayName
                };
            }
            this.loading = false;
        },
        async searchPolizas(event) {
            // Aquí puedes implementar la búsqueda dinámica, por ejemplo, filtrando la lista o haciendo una consulta al servidor
            const query = event.query;

            let result; // Declarar la variable result fuera del bloque if
            // Verifica si clienteSelectedId no es nulo
            if (this.selectedClienteId !== null) {
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
        polizaTemplate(poliza) {
            // Combina no_poliza y ini_vig, y quita espacios en no_poliza
            //const noPolizaSinEspacios = poliza.no_poliza.replace(/\s+/g, '');
            return `${poliza.no_poliza} - ${poliza.fec_vig_de}`;
        },
        onPolizaSelected(poliza) {
            this.selectedPoliza = poliza.value;
            this.selectedPolizaId = poliza.value.ot;
        },
        async getChecklistsTarjeta(tarjeta_id) {
            const result = await sendRequestList(url+"/itemstarjeta/"+tarjeta_id);
            this.checklists_tarjeta = result.data.data;
        },
        async addChecklist() {
            if (!this.card.id) { // si la tarjeta no esta guardada, primero se guarda la tarjeta y se asigna el card.id para poder relacionar a un checklist
                await this.handleSubmit();
            }

            if (this.checklist && this.tarjeta.categoria_id && this.card.id) {
                const params = {
                    checklist_id: this.checklist,
                    tarjeta_id: this.card.id
                };

                await sendRequest("POST", params, url+"/itemstarjetaimport");

                this.getChecklistsTarjeta(this.card.id);

                this.$refs.op.hide();
            }
        },
        async addBitacora() {
            if (!this.card.id) { // si la tarjeta no esta guardada, primero se guarda la tarjeta y se asigna el card.id para poder relacionar a un checklist
                await this.handleSubmit();
            }
            this.submittedComentario = false;

            if (this.comentario.length > 0 && this.card.id) {
                const params = {
                    descripcion: this.comentario,
                    tarjeta_id: this.card.id,
                };

                const result = await sendRequest("POST", params, url+"/bitacoras");
                if (result == "ok") {
                    this.comentario = "";
                    this.submittedComentario = true;
                } else {
                    this.$toast.add({severity:'error', summary: 'Error', detail: "Error al guardar el comentario", life: 3000});
                }
            }
        },
        fechaFormateada(fecha) {
            const anio = fecha.getFullYear();
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const dia = fecha.getDate().toString().padStart(2, '0');
            const hora = fecha.getHours().toString().padStart(2, '0');
            const minuto = fecha.getMinutes().toString().padStart(2, '0');

            return `${dia}/${mes}/${anio} ${hora}:${minuto}`;
        },
        fechaFormato(fechasinform) {
            let fecha = new Date(fechasinform);
            const anio = fecha.getFullYear();
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const dia = fecha.getDate().toString().padStart(2, '0');

            return `${dia}/${mes}/${anio}`;
        },
        formatDate(dateString) {
            const [datePart, timePart] = dateString.split(' ');
            const [day, month, year] = datePart.split('/');
            const formattedDatePart = `${year}-${month}-${day}`;

            return `${formattedDatePart} ${timePart}`;
        },
        confirmDeleteTarjeta(tarjeta) {
            this.card = tarjeta;
            this.deleteDialogTarjeta = true;
        },
        confirmClonar(tarjeta) {
            this.card = tarjeta;
            this.clonarDialogTarjeta = true;
        },
        async deleteTarjeta() {
            const id = this.card.id;
            const result = await sendRequest('DELETE', {id: id},url+"/tarjetas/"+id);
            if (result === "ok") {
                this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Tarjeta eliminada', life: 3000});
            } else {
                this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
            }

            this.deleteDialogTarjeta = false;
            this.card = {};
            this.hideDialogTarjeta();
        },
        async clonarTarjeta() {
            const id = this.card.id;
            let categoria =  (this.clonar.categoria_id) ? this.clonar.categoria_id :  this.card.categoria_id;
            let subramo = (this.clonar.subramo_id) ? this.clonar.subramo_id : this.card.subramo_id;
            let ramo = (this.clonar.ramo_id) ? this.clonar.ramo_id : this.card.ramo_id;
            const result = await sendRequest('POST', {id: id},url+"/clonartarjeta/"+id+"?tablero="+this.tablero+"&categoria="+categoria+"&subramo="+subramo+"&ramo="+ramo);
            if (result === "ok") {
                this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Tarjeta clonada', life: 3000});
                this.$refs.clonar.hide();
            } else {
                this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
            }

            this.clonarDialogTarjeta = false;
            this.card = {};
            this.hideDialogTarjeta();
        },
        async recibirValor(datos) {
            //this.$emit('datos', { columna: datos.columna, visible: true });
            await this.moveCard(this.tarjeta, datos.columna, 0);
            await this.getChecklistsTarjeta(this.card.id);
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
                url+"/switchcards/"+tarjeta.id,
                true
            );
            if(typeof result == "object") {
                this.card.nombre_columna = result.data.nombreColumna;
            } else {
                this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
            }
        },
    },
    mounted() {
        this.dialog = this.tarjetaDialog;
        if (this.tablero_id) {
            this.getCategorias();
            this.getGroupcategorias();
            this.getRamos();
        }

    },
    watch: {
        tarjetaDialog() {
            this.dialog = this.tarjetaDialog;
            if (this.dialog == true) {
                this.getTipoTablero();
                this.getConductosTarjeta();
                this.getUsuarios();
                this.getCias();
                this.mostrar_inicio = false;
                this.mostrar_compromiso = false;
                this.compromiso_disabled = false;
            }
        },
        async tarjeta() {
            if(this.tarjeta.id) {
                this.card = this.tarjeta;
                this.selectedObservadors = [];
                this.getChecklists();
                this.getChecklistsTarjeta(this.tarjeta.id);
                this.change_labels_bloqueo();
                const result = await sendRequest('GET', {},url+"/tarjetas/"+this.tarjeta.id, true);
                const complementar_tarjeta = {...result.data};
                this.card.observadores = complementar_tarjeta.observadores;
                this.tableroNombre =  complementar_tarjeta.tablero_nombre;
                this.card.cias = complementar_tarjeta.cias;

                this.selectedResponsableId = this.card.responsable;
                this.selectedClienteId = complementar_tarjeta.cliente_id;
                if (this.selectedClienteId) {
                    this.getCliente(this.selectedClienteId);
                }
                this.selectedPolizaId = complementar_tarjeta.poliza_id;
                if (this.selectedPolizaId) {
                    this.getPoliza(this.selectedPolizaId);
                }

                if(complementar_tarjeta.vendedor_id) {
                    this.getVendedor(complementar_tarjeta.vendedor_id);
                }

                this.card.categoria_nombre = complementar_tarjeta.categoria_nombre;
                this.card.ramo_id = complementar_tarjeta.ramo_id;
                this.card.subramo_id = complementar_tarjeta.subramo_id;

                const result_ramos = await sendRequestList(url+"/ramosselect?tablero="+this.tablero_id+"&nombre="+this.card.categoria_nombre);
                this.ramos = result_ramos.data.data;

                const result_subramos = await sendRequestList(url+"/subramosselect?tablero="+this.tablero_id+"&ramo="+this.card.ramo_id+"&nombre="+this.card.categoria_nombre);
                this.subramos = result_subramos.data.data;


                this.card.nombre_columna = complementar_tarjeta.nombreColumna;
                if (this.card.fecha_inicio != null) {
                    const fecha_inicio = this.formatDate(this.card.fecha_inicio);
                    this.fecha_inicio = this.card.fecha_inicio;
                    this.card.fechainicio = new Date(fecha_inicio);
                } else {
                    this.card.fechainicio = new Date();
                }
                if(this.card.fecha_compromiso != null) {
                    const fecha_compromiso = this.formatDate(this.card.fecha_compromiso);
                    this.fecha_compromiso = this.card.fecha_compromiso;
                    this.card.fechacompromiso = new Date(fecha_compromiso);
                }
                const categoria = this.buscarCategoriaId(this.card.categoria_id);
                if (categoria && categoria.tiempo_respuesta != null) {
                    this.compromiso_disabled = true;
                }
            } else {
                this.submitted = false;
                this.card = {};
                this.checklists_tarjeta = [];
                this.card.fechainicio = new Date();
                this.fecha_inicio = this.fechaFormateada(new Date());
                this.fecha_compromiso = this.fecha_inicio;
            }
            this.minDate = new Date();
        },
        tablero_id() {
            this.getCategorias();
            this.getGroupcategorias();
        }
    },
    computed: {
      formularioValido() {
        return this.card.titulo && this.card.descripcion && this.card.categoria_id;
      },
      formularioChecklistValido() {
        return this.checklist;
      }
    },

}
</script>

<style scoped>
.agregar-tarea-wrapper {
    display: inline-block;
    vertical-align: middle;
    padding-top: 5px;
}

.card {
    box-shadow: none !important;
}

.checklist-container {
    padding: 3px 15px !important;
}

/* Estilos específicos de los RadioButton de prioridad */
.alta-rb .p-radiobutton-box {
    border-color: #E20613;
    border: 3px solid #E20613;
    border-radius: 5px;
}
.alta-rb .p-radiobutton-box.p-highlight {
    background-color: #E20613 !important;
    border-color: #E20613 !important;
}
.alta-rb .p-radiobutton-icon {
    background-color: #E20613 !important;
}

/* Contenedores específicos del diseño */
.attachment-container,
.bitacora-container {
    background-color: #F5F5F5;
    border-radius: 10px;
    padding: 10px;
    margin: 5px 0;
}

.description-container {
    background-color: #ECECEC;
    border-radius: 10px;
    padding: 10px;
}

.card-container {
    padding: 5px 30px;
}

.grid-container {
    padding: 5px 25px;
}

.card-description {
    margin-left: 20px;
}

.button-footer {
    width: 7rem;  /* Hace que todos los botones sean del mismo tamaño */
    background: #D9D9D9;
}

.tablero {
    background-color: #D9D9D9;
    padding: 5px 30px;
}

.fechas {
    padding-top: 5px;
}

.tarjeta-wrapper {
    padding: 10px 20px;
}

.tarjeta-wrapper-left {
    padding: 10px 5px 0 0;
}

.tarjeta-wrapper-right {
    padding: 10px 0 0 5px;
}

.tarjeta-container {
    background-color: #ECECEC;
    border-radius: 15px;
    padding: 5px;
}

/* textarea {
    background-color: #fff !important;
    padding: 5px !important;
} */

.tablero .tablero-name {
    text-decoration: underline;
}

.overdue-0 {
    color: #E20613 !important;
}

.overdue-1 {
    color: #F29100 !important;
}

/* .p-button {
    color: #081136 !important;
    border: 2px solid #D9D9D9 !important;
    padding: 0.5rem 1rem !important; 
    font-size: .8rem !important;
    border-radius: 10px !important; 
}

.p-button.p-button-icon-only {
    padding: 0.3rem 0.5rem !important; 
} */

.attachment-container,
.bitacora-container {
    background-color: #F5F5F5;
    border-radius: 10px;
    padding: 10px;
    margin: 5px 0;
}

.description-container {
    background-color: #ECECEC;
    border-radius: 10px;
    padding: 10px;
}

.card-container {
    padding: 5px 30px;
}

.grid-container {
    padding: 5px 25px;
}

/* .p-button.full-width {
    width: 100% !important;
} */

.subheader-card-wrapper {
    background-color: #D9D9D9;
    padding: 1rem;
}

.flex-container {
    display: flex;
    flex-wrap: wrap; /* Asegura que los elementos se ajusten si no caben en una sola línea */
    justify-content: space-between; /* Espacio uniforme entre los elementos */
    align-items: center; /* Alinea verticalmente los elementos al centro */
    gap: 1rem; /* Espacio entre los elementos */
}

.flex-container > div {
    flex: 1; /* Distribuye los elementos equitativamente */
    min-width: 150px; /* Tamaño mínimo para cada elemento para evitar que se compriman demasiado */
}

.p-dialog-content {
    padding: 0 !important;
}


.p-card-element {
    padding: 0 .1rem;
    text-align: center;
}
</style>