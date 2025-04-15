import React from 'react'
import { useAuthStore } from '../../store/authStore'
import { Navigate } from 'react-router-dom';

const ProtectedVerifyRoute=({children})=>{
    const {user,isAuthenticated}=useAuthStore();
    console.log("isAuthenticated",isAuthenticated);
     if(!isAuthenticated){
        return <Navigate to="/login" replace/>
      }
      
      if(isAuthenticated && user?.isVerified){
        <Navigate to="/" replace/>
      }
      return children;
}

export default ProtectedVerifyRoute;
