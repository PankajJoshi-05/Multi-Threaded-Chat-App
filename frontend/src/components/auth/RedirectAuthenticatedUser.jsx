import { useAuthStore } from "../../store/authStore";

const RedirectAuthenticatedUser=({children})=>{
    const {isAuthenticated,user}=useAuthStore();

    // if user is authenticated and is verified
    if(isAuthenticated && user.isVerified){
       return <Navigate to="/"/>
    }
    return children;
}
export default RedirectAuthenticatedUser;