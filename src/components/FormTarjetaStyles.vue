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

.high-priority {
    border: 3px solid red;
    border-radius: 10px;
    padding: 0px 10px 0px 10px;
}

.medium-priority {
    border: 3px solid yellow;
    border-radius: 10px;
    padding: 0px 10px 0px 10px;
}

.low-priority {
    border: 3px solid green;
    border-radius: 10px;
    padding: 0px 10px 0px 10px;
}
/* Aplicar estilos cuando los radios están seleccionados */
/* Estilos para el estado Alta */
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

/* Estilos para el estado Media */
.media-rb .p-radiobutton-box {
    border-color: #F29100;
    border: 3px solid #F29100;
    border-radius: 5px;
}
.media-rb .p-radiobutton-box.p-highlight {
    background-color: #F29100 !important;
    border-color: #F29100 !important;
}
.media-rb .p-radiobutton-icon {
    background-color: #F29100 !important;
}

/* Estilos para el estado Baja */
.baja-rb .p-radiobutton-box {
    border-color: #009540;
    border: 3px solid #009540;
    border-radius: 5px;
}
.baja-rb .p-radiobutton-box.p-highlight {
    background-color: #009540 !important;
    border-color: #009540 !important;
}
.baja-rb .p-radiobutton-icon {
    background-color: #009540 !important;
}

.p-dialog .p-dialog-header {
    background: #4E556F !important;
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
    color: #ffffff !important;
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

.footer-container {
    padding: 5px 0px;
}

.tarjeta-titulo .pi {
    font-size: 1.3rem;
    margin-right: 15px;
}

.subheader-card-wrapper {
    background-color: #D9D9D9;
    padding: 13px 30px 5px;
    margin-bottom: 5px;
}

.tarjeta-subheader-title {
    font-size: .9rem;
    font-weight: 500;
    padding: 1rem .1rem;
    line-height: 2.5rem;
}

.tarjeta-date-subheader-title {
    font-size: .9rem;
    font-weight: 500;
    padding: .4rem .1rem 0;
    line-height: 1rem;
    text-align: center;
}

.subheader-value-container {
    border: 1.5px solid #fff !important;
    border-radius: 10px;
    display: inline-block;
    padding: 0 8px;
    margin: 0 8px;
}

.tarjeta-value-container {
    border: 1.5px solid #D9D9D9 !important;
    border-radius: 10px;
    display: inline-block;
    padding: 0 8px;
    margin: 0 8px;
}

.tarjeta-subheader-value {
    font-size: .9rem;
    color: #4E556F;
    font-weight: 500;
}

.tarjeta-subtitulo-prioridad {
    font-size: .8rem;
    font-weight: 600;
    text-align: right;
}

.tarjeta-subtitulo {
    font-size: .8rem;
    font-weight: 600;
}

.tarjeta-subtitulo .pi {
    font-size: 1.1rem;
    margin-right: 5px;
}

.tablero {
    background-color: #D9D9D9;
    padding: 5px 30px;
}

.fechas {
    padding-top: 5px;
}

.tarjeta-wrapper {
    padding: 10px 20px 10px 20px;
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

.attachment-container {
    background-color: #FFF;
    border-radius: 10px;
    padding: 8px;
    margin-top: 10px;
}

.attachment-icon {
    padding-right: 10px;
    padding-top: 3px;
}

textarea {
    background-color: #fff !important;
    padding: 5px !important;
}

.fechas .fecha-inicio, .fechas .fecha-compromiso {
    margin-bottom: 0;
}

.tablero .tablero-name {
    text-decoration: underline;
}

.tarjeta-titulo {
    text-transform: uppercase;
    font-size: 16px !important;
}

.tasks-block {
    padding-bottom: 0;
    min-height: 7.3rem;
}

.bitacora-block {
    padding-bottom: 0;
}

.calendar-wrapper {
    position: relative;
    z-index: 999;
}

.adjuntos-block {
    padding-bottom: 0;
    min-height: 3.7rem;
}

.add-comment-block {
    padding-bottom: 0;
}

.lh-2 {
    line-height: 2rem;
}

.no-side-padding {
    padding-left: 0;
    padding-right: 0;
}

.full-width {
    width: 100%;
}

.gap-1 {
    gap: 0.1rem !important;
}
.overdue-0 {
    color: #E20613 !important;
}

.overdue-1 {
    color: #F29100 !important;
}

/* .p-card-element {
    padding: 0 .1rem;
    text-align: center;
} */

.p-multiselect .p-multiselect-label {
    padding: 0.4rem 0;
    color: #4E556F;
    font-weight: 500;
}

.p-multiselect-chip .p-multiselect-label {
    padding: 0.4rem 0 !important;
    color: #4E556F;
    font-weight: 500;
}

.p-multiselect-trigger, .p-dropdown-trigger {
    display: none;
}

.p-multiselect-token {
    padding: 0rem 0.2rem !important;
    margin-right: 0.2rem !important;
}

.p-button {
    color: #081136 !important;
    border: 2px solid #D9D9D9 !important;
    padding: 0.5rem 0 !important;
    font-size: .8rem !important;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    border-radius: 10px;
}

.p-button.p-button-icon-only {
    padding: 0.1rem 0 !important;
}

.p-calendar {
    position: absolute;
}

.p-datepicker table th {
    padding: 0;
}

.p-datepicker table td {
    padding: 0;
}

.p-inputtext {
    background: none;
    padding: 5px 0 !important;
    color: #4E556F;
    font-weight: 500;
    width: 100%;
}

.p-inputtext-header {
    background: none;
    padding: 5px 0 !important;
    color: #FFF;
    font-weight: 500;
    width: 100%;
}

.p-inputtext:enabled:focus:hover {
    border: none;
    box-shadow: none;
    border-color: transparent;
}

.p-dialog-footer {
    padding: 1rem 1.5rem !important;
}

.p-dialog-content {
    padding: 0 !important;
}

.p-dropdown-label {
    padding: 5px 1px !important;
}

.p-radiobutton {
    width: 15px;
    height: 15px;
}

.p-radiobutton .p-radiobutton-box {
    width: 15px;
    height: 15px;
}

.pr-5 {
    padding-right: 5px !important;
}

.pr-10 {
    padding-right: 10px;
}

.pi-calendar {
    font-size: 1rem;
}

.pl-10 {
    padding-left: 10px;
}

.pt-40 {
    padding-top: 40px;
}

.prioridad-rb {
    display: inline-block;
}

.responsable-initials {
    text-decoration: underline;
}

.subtitle-card-wrapper {
    display: inline-block;
    padding-left: 5px;
}

/* Tamaño de la caja de comentarios */
.bitacora-comentario{display: flex !important; width: 100% !important;}
</style>