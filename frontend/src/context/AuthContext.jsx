import {createContext,useContext,useEffect,useState} from 'react';
import api from '../services/api';
const C=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(null),[loading,setLoading]=useState(true);
 useEffect(()=>{if(!localStorage.getItem('cinerate_token')){setLoading(false);return;}api.get('/auth/me').then(r=>setUser(r.data.user)).catch(()=>localStorage.removeItem('cinerate_token')).finally(()=>setLoading(false))},[]);
 const authenticate=async(path,payload)=>{const {data}=await api.post('/auth/'+path,payload);localStorage.setItem('cinerate_token',data.token);setUser(data.user);return data.user};
 const logout=()=>{localStorage.removeItem('cinerate_token');setUser(null)};
 return <C.Provider value={{user,loading,authenticate,logout}}>{children}</C.Provider>;
}
export const useAuth=()=>useContext(C);
