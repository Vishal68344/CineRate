import {Navigate,useLocation} from 'react-router-dom';import {useAuth} from '../context/AuthContext';
export default function ProtectedRoute({children}){const {user,loading}=useAuth(),location=useLocation();if(loading)return <p className="section muted">Loading...</p>;return user?children:<Navigate to="/login" state={{from:location.pathname}} replace/>}
