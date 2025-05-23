import {create} from "zustand";
import axios from "axios";
import toast from "react-hot-toast"
const API_URL="http://localhost:3000/api/v1/auth";

axios.defaults.withCredentials=true;

export const useAuthStore=create(
    (set)=>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    message:null,

    signup:async(userName,email,password)=>{
        set({isLoading:true,error:null});
        try{
           const response=await axios.post(`${API_URL}/signup`,{userName,email,password});
           console.log(response);
           set({
            user:response.data.user,isAuthenticated:true,isLoading:false,
            error:null
        });
         toast.success("Account created successfully!");
        }catch(error){
            console.log("Error in AuthStore",error);
            set({error:error?.response?.data?.message ||"Error signing Up",isLoading:false})
             toast.error(error.response?.data?.message||"Error Signing Up");
            throw error;
        }
    },

    login:async(email,password)=>{
         set({isLoading:true,error:null})
         try{
            const response=await axios.post(`${API_URL}/login`,{email,password});
            console.log(response.data.user);
            set({
                user:response.data.user,isAuthenticated:true,isLoading:false,
                error:null
            });
            toast.success("Logged in successfully!");
         } catch(error){
            console.log("Error in login AuthStore ",error);
            set({error:error.response?.data?.message||"Error logging in",isLoading:false})
            toast.error(error.response?.data?.message||"Error logging in");
            throw error;
         }   
    },

    logout:async()=>{
        set({isLoading:true,error:null});
        try{
           await axios.post(`${API_URL}/logout`);
           set({
            user:null,isAuthenticated:false,error:null,isLoading:false
        });
        toast.success("Logged out successfully!");
        }catch(error){
            set({error:"Error logging Out",isLoading:false});
            toast.error("Error logging out");
          throw error;
        }
    },

    verifyEmail:async(code)=>{
        set({isLoading:true,error:null});
        try{
            const response=await axios.post(`${API_URL}/verify-email`,{code});
            console.log(response);
            set({user:response.data.user,isAuthenticated:true,isLoading:false});
            toast.success("Email verified successfully!");
        }catch(error){
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            toast.error(error?.response?.data?.message || "Error verifying email");
			throw error;
        }
    },

    resendVerificationCode:async()=>{
        set({isLoading:true,error:null});
        try{
            const response=await axios.post(`${API_URL}/resend-verification-code`);
           console.log(response);
            set({isLoading:false,error:null});
            toast.success("Verification code resent successfully!");
            return response.data;
        }catch(error){
            console.log("Error in resendVerificationCode ",error);
            set({error:error.response.data.message||"Error resending verification code",isLoading:false});
            toast.error(error?.response?.data?.message || "Error resending verification code");
            throw error;
        }
    },

    checkAuth:async()=>{
        set({isLoading:true,error:null});
        try{
            const response=await axios.post(`${API_URL}/check-auth`);
            console.log(response);
            set({
                user:response.data.user,isAuthenticated:true,isLoading:false
            })
        }catch(error){
            set({
                user:null,isAuthenticated:false,isLoading:false
            })
        }
    },

    forgotPassword:async(email)=>{
        set({isLoading:true,error:null});
        try{
          const response=await axios.post(`${API_URL}/forgot-password`,{email});
          set({message:response.data.message,isLoading:false});
          toast.success(response.data.message);
        }catch(error){
            set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
            toast.error(error?.response?.data?.message || "Error sending reset password email");
			throw error;
        }
    },

    resetPassword:async(token,password)=>{
        set({isLoading:true,error:null});
        try{
         const response=await axios.post(`${API_URL}/reset-password/${token}`,{password});
         set({ message: response.data.message, isLoading: false });
         toast.success(message);
        }catch(error){
            set({
				isLoading: false,
				error: error.response.data.message || "Error sending resetting email",
			});
            toast.error(error?.response?.data?.message || "Error resetting password");
			throw error;
        }
    },

    setUser: (userData) => {set({ user: userData })
}
}
))