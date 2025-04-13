import React, { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  ProtectedRoute  from "./components/auth/ProtectedRoute";
import RedirectAuthenticatedUser from "./components/auth/RedirectAuthenticatedUser";

const SignUp = lazy(() => import("./pages/SignUp"));
const LogIn = lazy(() => import("./pages/LogIn"));
const EmailCodeVerification = lazy(() => import("./pages/EmailCodeVerification"));

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <h1>Home</h1>
          </ProtectedRoute>
        } />
          <Route path="/signup" element={
              <RedirectAuthenticatedUser>
                   <SignUp/>
              </RedirectAuthenticatedUser>
          } />
        <Route path="/login" element={
           <RedirectAuthenticatedUser>
                 <LogIn/>
           </RedirectAuthenticatedUser>
        } />
        <Route path="/verify-email" element={
            <EmailCodeVerification />
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
