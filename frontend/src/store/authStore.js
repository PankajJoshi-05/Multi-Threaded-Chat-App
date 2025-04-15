import {create} from "zustand";
import {persist} from "zustand/middleware"
import axios from "axios";

const API_URL="http://localhost:3000/api/v1/auth";

axios.defaults.withCredentials=true;

export const useAuthStore=create(
    (set)=>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,

    signup:async(userName,email,password)=>{
        set({isLoading:true,error:null});
        try{
           const response=await axios.post(`${API_URL}/signup`,{userName,email,password});
           console.log(response);
           set({
            user:response.data.user,isAuthenticated:true,isLoading:false,
            error:null
        });
        }catch(error){
            console.log("Error in AuthStore",error);
            set({error:error.response.data.message ||"Error signing Up",isLoading:false})
            throw error;
        }
    },

    login:async(email,password)=>{
        console.log("Login payload", { email, password });

         set({isLoading:true,error:null})
         try{
            const response=await axios.post(`${API_URL}/login`,{email,password});
            console.log(response.data.user);
            set({
                user:response.data.user,isAuthenticated:true,isLoading:false,
                error:null
            });
         } catch(error){
            console.log("Error in login AuthStore ",error);
            set({error:error.response?.data?.message||"Error logging in",isLoading:false})
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
        }catch(error){
            set({error:"Error logging Out",isLoading:false});
          throw error;
        }
    },

    verifyEmail:async(code)=>{
        set({isLoading:true,error:null});
        try{
            const response=await axios.post(`${API_URL}/verify-email`,{code});
            console.log(response);
            set({user:response.data.user,isAuthenticated:true,isLoading:false});
            return response.data;
        }catch(error){
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
        }
    },

    resendVerificationCode:async()=>{
        set({isLoading:true,error:null});
        try{
            const response=await axios.post(`${API_URL}/resend-verification-code`);
           console.log(response);
            set({isLoading:false,error:null});
            return response.data;
        }catch(error){
            console.log("Error in resendVerificationCode ",error);
            set({error:error.response.data.message||"Error resending verification code",isLoading:false});
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
    }
}
))