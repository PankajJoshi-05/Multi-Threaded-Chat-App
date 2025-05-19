import React, { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Loader } from "./components/Loader";
const SignUp = lazy(() => import("./pages/SignUp"));
const LogIn = lazy(() => import("./pages/LogIn"));
const EmailCodeVerification = lazy(() => import("./pages/EmailCodeVerification"));
const ForgotPassword=lazy(()=>import("./pages/ForgotPassword"));
const ResetPassword=lazy(()=>import("./pages/ResetPassword"));
const ProtectedRoute=lazy(()=>import("./components/auth/ProtectedRoute"));
const ProtectedVerifyRoute=lazy(()=>import("./components/auth/ProtectedVerifyRoute"))
const RedirectAuthenticatedUser=lazy(()=>import("./components/auth/RedirectAuthenticatedUser"));
const PageNotFound=lazy(()=>import("./pages/PageNotFound"));
const Home=lazy(()=>import("./pages/Home"));

const ChatList=lazy(()=>import("./components/panels/ChatList"));
const UserList = lazy(() => import("./components/panels/UserList"));
const CreateGroup = lazy(() => import("./components/panels/CreateGroup"));
const Profile = lazy(() => import("./components/panels/Profile"));
const Settings = lazy(() => import("./components/panels/Settings"));

function App() {
   const {checkAuth} =useAuthStore();
   useEffect(()=>{
     checkAuth();
     console.log("checking Auth...");
   },[checkAuth])
  
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home/>   
          </ProtectedRoute>
        }>
          <Route index element={<ChatList />} />
          <Route path="search-friend" element={<UserList />} />
          <Route path="create-group" element={<CreateGroup />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route element={<RedirectAuthenticatedUser/>}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
        <Route path="/verify-email" element={
          <ProtectedVerifyRoute>
             <EmailCodeVerification/>
            </ProtectedVerifyRoute>
          } />
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
