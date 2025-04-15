import React, { lazy, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  ProtectedRoute  from "./components/auth/ProtectedRoute";
import RedirectAuthenticatedUser from "./components/auth/RedirectAuthenticatedUser";
import ProtectedVerifyRoute from "./components/auth/ProtectedVerifyRoute"
import { useAuthStore } from "./store/authStore";
import { Loader } from "./components/Loader";

const SignUp = lazy(() => import("./pages/SignUp"));
const LogIn = lazy(() => import("./pages/LogIn"));
const EmailCodeVerification = lazy(() => import("./pages/EmailCodeVerification"));

function App() {
   const {checkAuth} =useAuthStore();

   useEffect(()=>{
     checkAuth();
   },[checkAuth])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <h1>Home</h1>
          </ProtectedRoute>
        } />
          <Route path="/signup" element={
            <RedirectAuthenticatedUser >
                   <SignUp/>
              </RedirectAuthenticatedUser>
          } />
        <Route path="/login" element={
           <RedirectAuthenticatedUser>
                 <LogIn/>
           </RedirectAuthenticatedUser>
        } />
        <Route path="/verify-email" element={
          <ProtectedVerifyRoute>
             <EmailCodeVerification/>
            </ProtectedVerifyRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
