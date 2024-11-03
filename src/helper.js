import Swal from "sweetalert2";
import axios from "axios";
import { useUserStore } from "@/store/user"; 

export function showAlert(title, icon, focus=''){
    if(focus!=''){
        document.getElementById(focus).focus();
    }

    Swal.fire({
        title: title,
        icon: icon,
        customClass: {confirmButton:'p-button', popup:'animated zoonIn'},
        buttonsStyling:false
    });
}

export async function sendRequest(method, params, url, getData = false) {
    const user = useUserStore();
    var status = ""
    await axios({
        method: method,
        url: url,
        data: params,
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    }).then(
        function(res) {
            var state = res.status;
            if (state == 200 || state == 204 || state == 201){
                status= "ok";
                if (getData == true) {
                    status = res.data;
                }
            } else {
                status ='Ocurrió un error en la petición';
            }
        }
    ).catch(function(error){        
        if (!error.response) {            
            status = 'Error: Network Error';
        } else {
            status = error.response.data.message;
        }
    });

    return status;
}

export async function sendRequestList(url) {
    const user = useUserStore();
    
    const data = await axios({
        method: "GET",
        url: url,        
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    });
    
    return data;
}

export function userCan(action) {
    const user = useUserStore();
    if ( user.permissions.includes(action)) {
        return true;
    }
    return false;
}

export function createChannelConection() {
    const user = useUserStore();
     // Verificar si el usuario está autenticado
     if (!user.isAuthenticated()) {
        console.error("User is not authenticated or ID is not valid.");
        return null;
    }
    return "notificacion."+user.id;
}