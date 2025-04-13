import React from "react"
import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore";
const ProtectedRoute=({children})=>{
   const {isAuthenticated,user}=useAuthStore();

   // if user not authenticated
   if(!isAuthenticated){
    return <Navigate to="/login"/>}

//  if user's email is not verified
   if(!user.isVerified){
    return <Navigate to="/verify-email"/>
   }
  return children;
}

export default ProtectedRoute;