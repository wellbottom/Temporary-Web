//interceptor using axios

import axios from "axios"
import {ACCESS_TOKEN} from "./constant"
<<<<<<< HEAD

=======
>>>>>>> b3c10626f68a040a33cf6bfcd8239e757588c866
const apiUrl = "/choreo-apis/temporary-webapp/backend/v1";
const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
})

api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) =>{
        return Promise.reject(error)
    }
)


export default api
