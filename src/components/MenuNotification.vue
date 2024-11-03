<template>
    <!-- Botón con ícono de cesto de basura -->
    <Button icon="pi pi-trash" text rounded  @click="ocultar" aria-label="Eliminar notificación" />
</template>

<script>
import { sendRequest } from '@/helper';

const url = import.meta.env.VITE_APP_BASE_URL;
export default {
    emits: ['datos'],
    props: {
        notificacion: {
            type: Object,
            required: true
        },
    },
    methods: {
        async ocultar() {
            // Llamada para ocultar la notificación
            await sendRequest('PUT', {}, url + "/ocultar_notificaciones/" + this.notificacion.id);

            // Emitir el evento con los datos
            this.$emit('datos', { ocultar: true });
        }
    }
}
</script>
