import React, { useState, useRef, useEffect } from 'react';
import Avatar from '../ui/Avatar';
import { Edit2, Check, X ,Camera} from 'lucide-react';
import {useUserStore } from "../../store/userStore"
import ProfileSkeleton from "../skeletons/ProfileSkeleton";
const Profile = () => {
   const {getProfile,isUserProfileLoading,userProfile,error,updateProfile}=useUserStore();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingName,setisEditingName]=useState(false);
  const [isEditingBio,setisEditingBio]=useState(false);
  const [tempName,setTempName]=useState('');
  const [tempBio,setTempBio]=useState('');
  const [tempProfilePic,setTempProfilePic]=useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setTempName(userProfile.userName);
      setTempBio(userProfile.bio);
      setTempProfilePic(userProfile.profile);
    }
  }, [userProfile]);

  const handleCancelEditName=()=>{
    setTempName(userProfile.userName);
    setisEditingName(false);
  }
  const handleSaveName=async ()=>{
    const formData=new FormData();
    formData.append('userName', tempName);
    formData.append('bio', tempBio); 
    formData.append('profile', tempProfilePic);
    await updateProfile(formData);
    setisEditingName(false);
  }
  const handleCancelEditBio=()=>{
    setTempBio(userProfile.bio);
    setisEditingBio(false);
  }
  const handleSaveBio=async()=>{
    const formData=new FormData();
    formData.append('userName', tempName);
    formData.append('bio', tempBio); 
    formData.append('profile', tempProfilePic);
    await updateProfile(formData);
    setisEditingBio(false);
  }
 const handleProfileClick=()=>{
  fileInputRef.current.click();
 }
  const handleProfilePicChange=async (e)=>{
     const file=e.target.files[0];
     if(!file)return;
     const formData=new FormData();
     formData.append('profile',file); 
     formData.append('userName',tempName); 
     formData.append('bio',tempBio); 

     setIsUploadingImage(true);
     await updateProfile(formData);
     setIsUploadingImage(false);
  }
   if(isUserProfileLoading || !userProfile) {
    return <ProfileSkeleton/>;}

  return (
    <div className="h-full w-full flex flex-col bg-gray-400 p-4">

      <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
      
      <div className="flex justify-center items-center mb-2">
      <div className=" relative bg-slate-300 rounded-full h-[200px] w-[200px] overflow-hidden cursor-pointer"
      onMouseEnter={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
      onClick={handleProfileClick}>
         <Avatar src={tempProfilePic} alt={tempName}/>
        {isHovered && ( <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
              {isUploadingImage ? (
                <span className="text-white text-sm">Uploading...</span>
              ) : (
                <Camera className="text-white w-12 h-12" />
              )}
            </div>)}
      </div>
      <input
       type="file" 
       ref={fileInputRef}
       accept="image/*"
       onChange={handleProfilePicChange}
       className="hidden"/>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-2">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Your Name  {isEditingName && (
            <span className="text-xs text-gray-400 ml-2">
              {20 - tempName.length} characters remaining
            </span>
          )}</h2>
         <div className="flex items-center justify-between border-b-2 border-gray-300 py-2">
          {isEditingName?(
            <>
            <input type="text"
            value={tempName}
            onChange={(e)=>{const value = e.target.value;
              if (value.length <= 20) {
                setTempName(value);
              }}}
            className="flex-1 outline-none"
            autoFocus
            maxLength={20}
            required
            />
            <div className='flex gap-2'>
              <button className="text-green-500"
              onClick={handleSaveName}>
                <Check/>
              </button>
              <button className="text-red-500"
              onClick={handleCancelEditName}>
                <X/>
              </button >
            </div>
            </>
          ):(
           <>
             <span className="text-gray-800">{userProfile.userName}</span>
             <button 
             onClick={()=>{
              setTempName(userProfile.userName);
              setisEditingName(true);
             }}>
              <Edit2/>
             </button>
           </>
          )}
         </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-2 ">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Your Email</h2>
          <p className='border-b-2 p-3 border-gray-300'>{userProfile.email}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-2">
        <h2 className="text-sm font-medium text-gray-500 mb-1">About {isEditingBio && (
            <span className="text-xs text-gray-400 ml-2">
              {70 - tempBio.length} characters remaining
            </span>
          )}</h2>
         <div className="flex items-center justify-between border-b-2 border-gray-300 py-2 ">
          {isEditingBio?(
            <>
            <input type="text"
            value={tempBio}
            onChange={(e)=>{
              const value=e.target.value
              if (value.length <= 70) {
                setTempBio(value);
              }}}
            className="flex-1 outline-none flex-wrap"
            autoFocus
            />
            <div className='flex gap-2'>
              <button className="text-green-500"
              onClick={handleSaveBio}>
                <Check/>
              </button>
              <button className="text-red-500"
              onClick={handleCancelEditBio}>
                <X/>
              </button >
            </div>
            </>
          ):(
           <>
             <span className="text-gray-800">{userProfile.bio}</span>
             <button 
             onClick={()=>{
              setTempBio(userProfile.bio);
              setisEditingBio(true);
             }}>
              <Edit2/>
             </button>
           </>
          )}
         </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-2">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Last Login</h2>
          <p className='border-b-2 p-3 border-gray-300'>{new Date(userProfile.lastLogin).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Profile;
