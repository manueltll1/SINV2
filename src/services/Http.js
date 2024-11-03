import { useUserStore } from "@/store/user";
import axios from "axios";
//const url_base = "https://api.inv.mx/api";
const url_base = import.meta.env.VITE_APP_BASE_URL;

export const http = () => {

    const user = useUserStore();
    const api = axios.create({
        baseURL: url_base,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    })
    // interceptar errores 401, 403
    api.interceptors.response.use(
        (response) =>{
            return response;
        },
        (error)=> {
            if (error.response.status === 401) {
                localStorage.removeItem("access_token")
                window.location = "/login"
            }
            if (error.response.status === 403) {
                // roles
            }

            return Promise.reject(error)
        }
    )

    return api;
}