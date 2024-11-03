<template>
<Card :class="['tarjeta', { 'high-priority': tarjeta.prioridad === 'Alta', 'medium-priority': tarjeta.prioridad === 'Media', 'low-priority': tarjeta.prioridad === 'Baja' }]" 
      @click="editTarjeta" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
  <template #title>
      <div class="flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
              <span class="p-text uppercase">{{ tarjeta.id }}. {{ tarjeta.titulo }}</span>
          </div>
      </div>
  </template>
  <template #content>
      <div v-if="tipo_lista!='Pendiente'">
          <span :class="['badge badge-transparent calendar-container', this.overdue(tarjeta.fecha_compromiso)]">
              <i class="pi pi-calendar m-right"></i>
              <span class="calendar-date" v-if="tarjeta.fecha_compromiso">{{ tarjeta.fecha_compromiso }}</span>
          </span>
      </div>
      <!-- <span>{{ tarjeta }}</span> -->
      <div>
          <span v-if="tarjeta.fecha_recordatorio" :class="['badge badge-transparent calendar-container', this.overdue(tarjeta.fecha_recordatorio)]">
              <i class="pi pi-clock m-right"></i>
              <span v-if="tarjeta.fecha_recordatorio">{{ tarjeta.fecha_recordatorio }}</span>
          </span>
      </div>
  </template>
  <template #footer>
    <div class="icons-container">
      <div class="flex flex-wrap align-items-center justify-content-between gap-1">
          <div v-if="tarjeta.progreso != null" >
              <span class="badge badge-grey">
                  <i class="pi pi-check-square m-right"></i>
                  <span >{{ tarjeta.progreso }}</span>
              </span>
          </div>
          <div v-if="tipo_lista!='Pendiente'">
            <span class="badge badge-grey">
                <i class="pi pi-hourglass m-right"></i>
                <span>{{ tarjeta.edad }}</span>
            </span>
        </div>
        <div>
            <span class="badge badge-grey-border">
                <span >{{ tarjeta.iniciales }}</span>
            </span>
            <i class="pi pi-ban m-left m-right" v-if="tarjeta.estatus=='bloqueada'" />
            <!-- <i v-badge.danger="2" class="pi pi-bell m-right" style="font-size: 1rem" /> -->
        </div>
      </div>
    </div>
    <!-- <pre>{{ tarjeta }}</pre> -->
  </template>
</Card>
</template>

<style>
  .calendar-container {
    padding: 0 !important;
    margin: 0 !important;
  }
  .p-card-body {
    padding: .1rem .6rem !important;
  }
  .p-card .p-card-title {
    font-size: 1rem;
    font-weight: 500;
    padding: .3rem 0 0;
    margin-bottom: 0;
  }
  .p-card .p-card-content {
    padding: 4px 0 0;
  }
  .p-card .p-card-footer {
    padding: 4px 0 4px;
  }
  .p-badge {
    min-width: 1rem;
    height: 1rem;
    line-height: 1rem;
  }
  .badge {
    color: #ffffff;
    font-size: 0.70rem;
    font-weight: 700;
    min-width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    display: inline-block;
    border-radius: 3px;
    text-align: center;
    padding: 0 4px;
    margin: 0;
  }
  .badge-transparent {
    color: #495057;
    background: transparent;
  }
  .badge-blue {
    background: #3B82F6;
  }
  .badge-grey {
    color: #081136;
  }
  .badge-grey-border {
    border-radius: 50%;
    color: #FFF;
    background-color: #737789;
    padding: 0;
  }
  .badge-red {
    background: #ef4444;
  }
  .badge-yellow {
    background: #f5d046;
  }
  .icons-container {
    background-color: #D9D9D9;
    padding: 3px;
    border-radius: 4px;
  }
  .pi:before {
    vertical-align: middle !important;
  }
  .calendar-date {
    font-size: 0.8rem;
  }
  .pi-calendar {
    font-size: 0.8rem;
  }

  .p-button {
    font-size: .9rem;
  }

  .p-card::before {
    content: '';
    position: absolute;
    top: -7px;
    left: 75%;
    transform: translateX(-50%);
    width: 5rem;
    height: 7px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  
  .p-card.high-priority::before {
    background-color: #E20613;
  }

  .p-card.medium-priority::before {
    background-color: #F29100;
  }

  .p-card.low-priority::before {
    background-color: #009540;
  }

  .tarjeta {
    border: none !important;
  }

  .m-right {
    margin-right: 4px !important;
  }

  .m-left {
    margin-left: 4px !important;
  }

  .overdue-0 {
    color: #E20613 !important;
  }

  .overdue-1 {
    color: #F29100 !important;
  }

</style>

<script>
import moment from 'moment';
export default {
    emits: ['datos'],
    props: {
        tarjeta: {
            type: Object,
            required: true
        },
        tipo_lista: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            tarjeta_info: {},
        }        
    },
    methods: {
        handleTouchStart() {
          this.touchStartTime = new Date().getTime();
        },
        handleTouchEnd() {
          const touchEndTime = new Date().getTime();
          if (touchEndTime - this.touchStartTime < 500) {
            this.editTarjeta();
          }
        },
        async editTarjeta() {
            this.$emit('datos', { visible: true, tarjeta: this.tarjeta});
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

        }
    }
};
</script>