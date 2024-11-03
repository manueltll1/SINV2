<template>
<Dropdown
    v-model="columna"
    :options="columnas"
    optionLabel="nombre"
    optionValue="id"
    class="w-full"
    @change="mover"
    :disabled="this.allow_select"
    :placeholder="this.place_holder_column"
/>

</template>

<script>
import { sendRequestList } from '@/helper';


const url = import.meta.env.VITE_APP_BASE_URL;

export default {
    props: {
        card: {
            type: Object,
            required: true
        },
        tablero_id: {
            type: String,
            required: true
        },        
    },
    emits: ['datos'],
    data(){
        return{
            columnas: [],
            columna: 0,
            allow_select: true,
            place_holder_column: ""
        }
    },
    methods: {
        async getColumnas() {
            if (this.card.id) {
                this.allow_select = false;                
            }
            const tablero_id = this.tablero_id;
            this.loading = true;
            const result = await sendRequestList(url+"/columnaslist?tablero_id="+tablero_id);
            this.columnas = result.data;
            this.loading = false;
            if(this.columnas.length > 0) {
                const columna = this.columnas[0];
                this.place_holder_column = columna.nombre;
            }
        },
        mover() {
            this.$emit('datos', { columna: this.columna });
        }
    },
    mounted() {
        this.getColumnas();
        this.columna = this.card.columna_id;
    }
};
</script>