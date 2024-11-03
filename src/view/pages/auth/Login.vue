<template>
    <!-- <FloatingConfigurator /> -->
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden login-wrapper">
        <div class="flex flex-col items-center justify-center">
            <div class="flex justify-center mb-1">
                <img src="/layout/images/logos-juntos-recurso.png" alt="Image" class="login-logo-img" />
            </div>
            <div class="col-10 lg:col-5 xl:col-5" style="border-radius:56px; padding:0.3rem; ">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-10 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenid@!</div>
                        <span class="text-muted-color font-medium">Inicio de Sesión</span>
                    </div>
                    <form action class="form" @submit.prevent="login">
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email" class="mb-4" v-model="email"/>  

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" type="password" class="mb-4" placeholder="Contraseña"  />
                        <p v-if="error" class="error">
                            Has introducido mal el email o la contraseña.
                        </p>                   
                        <Button type="submit" class="block mb-4 ingresar-btn" label="Ingresar"></Button>
                    </form>
                </div>
            </div>
            <img src="/layout/images/sello-recurso.png" alt="Image" class="flex justify-center mb-1 login-calidad-img" />
            <div class="flex justify-center mb-1">
                <div class="login-footer">
                    <div class="text-center login-footer-wrapper">
                        <div class="col-12">
                            <div class="desarrollo-lbl mt-3">Desarrollado por INV Agente de Seguros y de Fianzas SA de CV. © Todos los derechos reservados</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script >
import { login } from '@/auth/user';

export default {    
    data() {
        return {
            email: '',
            password: '',
            error: false,            
        }
    },
    computed: {
        logoColor() {
            if (this.$appState.darkTheme) return 'white';
            return 'dark';
        }
    },
    methods: {

        login(){
            var params = {
                user: this.email,
                password: this.password
            }

            login(params);
                                   
            this.email = "";
            this.password = "";            
        }
    }
}
</script>

<style scoped>
.login-wrapper {
    background-color: #191A33 !important;
}
.pi-eye {
    transform:scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform:scale(1.6);
    margin-right: 1rem;
}

.bienvenido-lbl {
    color: #191A33;
    font-size: 24px;
    font-weight: bold;
}

.desarrollo-lbl {
    font-size: 12px;
    color: #fff;
}

.login-footer {
    position: absolute;
    bottom: 0px;
}

.login-footer-wrapper {
    display: inline-block;
}

/* .inicio-sesion-lbl {
    font-size: 13px;
    color: #05B8DD;
} */

.ingresar-btn {
    background-color: #4E556F;
    color: #fff !important;
    font-size: 14px !important;
    /* padding: 0.5rem 2rem !important; */
    width: 100%;
}

.login-logo-img {
    /* padding-top: 30px; */
    width: 70%;
}

.login-calidad-img {
    padding-top: 10px;
    width: 30%;
}

/* .p-inputtext {
    padding: 5px 0 5px 15px !important;
} */
</style>