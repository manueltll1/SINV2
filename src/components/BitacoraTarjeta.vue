<template>
  <div class="task-container" v-if="bitacoras.length > 0">
    <div ref="listaContainer" style="overflow-y: auto;" class="grid grid-nogutter" >
      <div v-for="(item, index) in bitacoras" :key="index" class="col-span-12">
        <div class="flex align-items-center gap-4" >
          <span class="font-medium text-secondary text-xs"><i class="pi pi-user pdr"></i> {{ item.usuario }}</span>
          <span class="font-medium text-secondary text-xs">{{ item.created_at }}</span>
        </div>
        <div class="bitacora-container" :class="{ 'border-top-1 surface-border': index !== 0 }">
          <span class="font-medium text-secondary">{{ item.descripcion }}</span>           
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendRequestList, userCan } from '@/helper';
const url = import.meta.env.VITE_APP_BASE_URL;  

export default {
  props: {
    tarjeta: {
      type: Object,
      required: true
    },
    submittedComentario: {
      type: Boolean,
      required: true
    }
  },
  data(){
    return{
      bitacoras: [],      
    }
  },
  methods: {
    async getBitacoras(tarjeta) {
      if (tarjeta.id) {
        const result = await sendRequestList(url+"/bitacoras?tarjeta_id="+tarjeta.id);
        this.bitacoras = result.data.data;
        if (this.bitacoras.length > 0) {
          this.irAlFinal();
        }
      }
    },
    can(action) {
      return userCan(action);
    },
    irAlFinal() {
      this.$nextTick(() => {
        const container = this.$refs.listaContainer;
        container.scrollTop = container.scrollHeight;
      });
    }
  },
  mounted() {
    this.getBitacoras(this.tarjeta);
  },
  watch: {
    submittedComentario() {
      if (this.submittedComentario == true) {
        this.getBitacoras(this.tarjeta);
      }      
    }
  }
}
</script>
<style>
.badge-secondary {
    background-color: #f4f8f3;
    color: #000;
  }

.bitacora-container {
  margin: 5px 0 20px 0;
  padding: 10px 15px;
  border-radius: 12px;
  background-color: #f1f5f9;
}
</style>