<template>
  <div v-if="checklists.length >0">
    <ProgressBar :value="this.progreso_general" />
  </div>
  <div class="col-12">
  <div v-for="(item, index) in data" :key="item.id">
    <div v-if="deleteChecklist.indexOf(item.id) < 0">
      <div class="task-container">
        <div class="flex flex-wrap align-items-center justify-content-between gap-3 tarea">
          <!-- <b v-if="item.tipo == 'catalogo'"> {{ item["nombre"] }} </b> -->
          <b v-if="item.tipo == 'catalogo' && !item.nombre == ''"><i class="pi pi-check-square pdr"></i> {{ item.nombre }}</b>
          <b v-else>Tareas</b>
          <div></div>
          <Button v-if="can('itemstarjeta.destroy')" icon="pi pi-trash" label="Borrar" text @click="confirmDelete(item.id, index)" />
        </div>
      <div v-for="(task, subindex) in item['items']" :key="task.id">
        <div class="flex align-items-center gap-2 mb-1">
          <Checkbox v-model="selectedTask" :inputId="task.nombre" name="task" :value="task.id"  @change="cambiar(index, subindex, task.id)"/>
          <label v-if="selectedTask.indexOf(task.id) != -1" :for="task.id" class="ml-2 checked">{{ task.nombre }}</label>
          <label v-else :for="task.id" class="ml-2">{{ task.nombre }}</label>
          

          <button v-if="item.tipo == 'tarjeta'" class="icon-button" @click="removeTask(index, subindex, task.id)">
            <i class="pi pi-times"></i>
          </button>
        </div>        
      </div>
      </div>
    </div>
  </div>
  </div>

  <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}"  :modal="true">
    <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Realmente desea eliminar la checklist ?</span>
    </div>
    <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteDialog = false"/>
        <Button label="Si" icon="pi pi-check" text @click="deleteChecklistTarjeta()" />
    </template>
  </Dialog>
</template>

<script>
import { sendRequest, userCan} from '@/helper';
const url = import.meta.env.VITE_APP_BASE_URL;
export default {
  props: {
    checklists: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedTask: [],
      progreso: [],
      data: [],
      cheklist_tarjeta: 0,
      deleteDialog: false,
      deleteIndex: 0,
      deleteChecklist: [],
      progreso_general: 0
    }
  },
  methods: {
    async removeTask(index, subindex, task_id) {
      const result = await sendRequest('DELETE', {id: task_id},url+"/itemstarjetadelete/"+task_id); 
      if (result === "ok") {
        this.data[index].items.splice(subindex, 1);
        
        if(this.data[index].items.length === 0) {
          this.data.splice(index, 1);
        }
        this.calcularProgreso();
      }
    },
    async cambiar(index, subindex, task_id) {            
      var result = "";
      result = await sendRequest(
        "PUT",
        {},
        url+"/markitemtarjeta/"+task_id
      );
      if (result === "ok") {
        this.data = this.checklists;
        this.data[index].items[subindex].completado = this.data[index].items[subindex].completado === 1 ? 0 : 1;
        this.calcularProgreso();        
      }
    },
    loadSelected() {
      this.checklists.forEach(item => {
        item.items.forEach(task => {
          if(task.completado == 1) {
            this.selectedTask.push(task.id);
          }
        })
      });      
    },
    calcularProgreso() {      
      this.progreso = [];
      this.data.forEach(lista => {
        const checklistsSeleccionados = lista.items.filter(checklist => checklist.completado == 1).length;
        const porcentaje = Math.round((checklistsSeleccionados / lista.items.length) * 100);
        this.progreso.push(porcentaje);
      });

      const total = this.progreso.reduce((total, valor) => total + valor, 0);
      this.progreso_general = Number((total / this.progreso.length).toFixed(2));
    },
    can(action) {
      return userCan(action);
    },
    confirmDelete(cheklist_tarjeta, index) {
      this.cheklist_tarjeta = cheklist_tarjeta;
      this.deleteIndex = index;
      this.deleteDialog = true;
    },
    async deleteChecklistTarjeta() {
      const id = this.cheklist_tarjeta;
      const result = await sendRequest('DELETE', {id: id},url+"/itemstarjeta/"+id); 
      if (result === "ok") {
        this.data.splice(this.deleteIndex, 1);
        this.deleteChecklist.push(id);
        this.calcularProgreso();
        this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Checklist eliminada', life: 3000});
      } else {
        this.$toast.add({severity:'error', summary: 'Error', detail: result, life: 3000});
      }
      this.deleteDialog = false;
      this.cheklist_tarjeta = 0;
    },
  },
  mounted() {
    this.data = this.checklists;
  },
  watch: {
    checklists(){
      this.data = this.checklists;
      this.calcularProgreso();
      this.loadSelected();
    }
  }
};
</script>

<style>
.checked {
  text-decoration: line-through;
}
.icon-button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 0; /* Elimina el relleno */
  color: blue; /* Color azul por defecto */
  transition: box-shadow 0.3s; /* Transición suave */
}

.icon-button:hover {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2); /* Sombra redondeada al pasar el mouse */
  border-radius: 80%; /* Borde redondeado */
}

.tarea {
  border-bottom: 1px solid #000;
  margin-bottom: 10px;
  padding-bottom: 10px;
}

.task-container {
  padding: 10px 0;
}

.pdr {
  padding-right: 10px;
}
</style>