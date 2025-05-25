import React from "react"
import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore";
const ProtectedRoute=({children})=>{
   const {isAuthenticated,user}=useAuthStore();
   // if user not authenticated
   if(!isAuthenticated){
    return <Navigate to="/login" replace/>}

//  if user's email is not verified
   console.log(user);
  return children;
}

export default ProtectedRoute;