import { showAlert } from "@/helper";
import { useUserStore } from "@/store/user";
import axios from "axios";
import { useRouter } from "vue-router";

const URL_BASE= import.meta.env.VITE_APP_BASE_URL;

export function login(params) {
    const user = useUserStore();
    const router = useRouter();    
    axios({
        method: "POST",
        url: URL_BASE+"/login",
        data: params
    }).then(
        function(res) {
            var state = res.status;
            if (state == 200) {
                const userData = res.data;
                user.setData(userData.token, userData.id, userData.username, userData.roles, userData.permissions);
                showAlert("Bienvenido/a", 'success');
                window.setTimeout(function(){
                    window.location.href= "/dashboard"
                }, 1000);
            } else {
                showAlert('Ocurrió un error en la petición', 'error');
            }
        }
    ).catch(function(error){
        var errorStatus = ""
        if (!error.response) {            
            errorStatus = 'Error: Network Error';
        } else {
            errorStatus = error.response.data.message;
        }        
        showAlert(errorStatus, 'error');        
    });     
}

export function logout() {
    const user = useUserStore();
    axios({
        method: "POST",
        url: URL_BASE+"/logout",
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    }).then(() => {
        user.$reset();        
        window.location.href= "/login"
    })
      .catch(err => {
        console.error('Error recibido en la solicitud:', err);
        window.location.href= "/login";
    });
    
}