import {create } from 'zustand';
import axios from "axios";
import { useAuthStore } from './authStore';

axios.defaults.withCredentials=true;

const API_URL='http://localhost:3000/api/v1/user'

export const useUserStore = create((set) => ({  
    userProfile:null,
    isuserProfileLoading:false,
    error:null,
    message:null,

    getProfile:async()=>{
        set({isuserProfileLoading:true,error:null,message:null});
        try{
            const res=await axios.get(`${API_URL}/get-profile`);
            set({userProfile:res.data,isuserProfileLoading:false});
            console.log("User Profile",res.data);
        }catch(err){
            set({ error: err.response?.data?.message || err.message, isUserProfileLoading: false });
        }
    },

    updateProfile:async(formData)=>{
        console.log(formData.bio);
        set({isLoading:true,error:null,message:null});
        try{
            const res=await axios.put(`${API_URL}/update-profile`,formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                  },
            });
            console.log("Update Profile Response",res.data.user);
            set({userProfile:res.data.user,isLoading:false});
            const {setUser}=useAuthStore.getState();
            setUser(res.data.user);
        }catch (err) {
            set({ error: err.response?.data?.message || err.message, isUserProfileLoading: false });
        }
    }
}));