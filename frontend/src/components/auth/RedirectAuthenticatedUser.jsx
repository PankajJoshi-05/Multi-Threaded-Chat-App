import { useAuthStore } from "../../store/authStore";
import { Navigate, Outlet } from "react-router-dom";

//redirect authenticated users to home page
const RedirectAuthenticatedUser=()=>{
    const {isAuthenticated,user}=useAuthStore();
    console.log(isAuthenticated);
    console.log(user?.isVerified);
    // if user is authenticated and is verified
    if(isAuthenticated && user?.isVerified){
       return <Navigate to="/" replace/>
    }
    return <Outlet/>;
}
export default RedirectAuthenticatedUser;