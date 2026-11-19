import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'/api',timeout:15000});
api.interceptors.request.use(config=>{const token=localStorage.getItem('cinerate_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config});
export const message=e=>e.response?.data?.error||e.message||'Something went wrong';
export default api;
