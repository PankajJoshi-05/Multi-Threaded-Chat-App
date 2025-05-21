import React, { useState, useRef, useEffect } from 'react';
import Avatar from '../ui/Avatar';
import { Edit2, Check, X, Camera } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import ProfileSkeleton from '../skeletons/ProfileSkeleton';

const Profile = () => {
  const { getProfile, isUserProfileLoading, userProfile, updateProfile } = useUserStore();

  const [isHovered, setIsHovered] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempBio, setTempBio] = useState('');
  const [tempProfilePic, setTempProfilePic] = useState('');
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

  const handleCancelEditName = () => {
    setTempName(userProfile.userName);
    setIsEditingName(false);
  };

  const handleSaveName = async () => {
    const formData = new FormData();
    formData.append('userName', tempName);
    formData.append('bio', tempBio);
    formData.append('file', tempProfilePic);
    await updateProfile(formData);
    setIsEditingName(false);
  };

  const handleCancelEditBio = () => {
    setTempBio(userProfile.bio);
    setIsEditingBio(false);
  };

  const handleSaveBio = async () => {
    const formData = new FormData();
    formData.append('userName', tempName);
    formData.append('bio', tempBio);
    formData.append('file', tempProfilePic);
    await updateProfile(formData);
    setIsEditingBio(false);
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userName', tempName);
    formData.append('bio', tempBio);

    setIsUploadingImage(true);
    await updateProfile(formData);
    setIsUploadingImage(false);
  };

  if (isUserProfileLoading || !userProfile) return <ProfileSkeleton />;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-primary mb-4">Your Profile</h1>

      {/* Profile Picture */}
      <div className="flex justify-center">
        <div
          className="relative rounded-full h-44 w-44 overflow-hidden shadow-lg cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleProfileClick}
        >
          <Avatar src={tempProfilePic} alt={tempName} className="h-full w-full object-cover" />
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              {isUploadingImage ? (
                <span className="text-white text-sm">Uploading...</span>
              ) : (
                <Camera className="text-white w-8 h-8" />
              )}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleProfilePicChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Name Section */}
      <div className="bg-base-200 rounded-xl p-4 shadow-md">
        <div className="mb-1 text-lg font-semibold text-base-content">Your Name</div>
        <p className="text-sm text-muted">This name will be visible to others.</p>
        <div className="mt-3 flex items-center gap-4">
          {isEditingName ? (
            <>
              <input
                type="text"
                value={tempName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 20) setTempName(value);
                }}
                className="flex-1 border rounded-md px-3 py-2 bg-background text-foreground outline-none"
                autoFocus
              />
              <button className="text-success" onClick={handleSaveName}>
                <Check />
              </button>
              <button className="text-error" onClick={handleCancelEditName}>
                <X />
              </button>
            </>
          ) : (
            <>
              <span className="text-base-content text-lg font-medium">{userProfile.userName}</span>
              <button onClick={() => setIsEditingName(true)}>
                <Edit2 />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Email Section */}
      <div className="bg-base-200 rounded-xl p-4 shadow-md">
        <div className="mb-1 text-lg font-semibold text-base-content">Email</div>
        <p className="text-sm text-muted">This is your registered email.</p>
        <div className="mt-3 text-base-content">{userProfile.email}</div>
      </div>

      {/* Bio Section */}
      <div className="bg-base-200 rounded-xl p-4 shadow-md">
        <div className="mb-1 text-lg font-semibold text-base-content">About</div>
        <p className="text-sm text-muted">Write something about yourself (max 70 characters).</p>
        <div className="mt-3 flex items-center gap-4">
          {isEditingBio ? (
            <>
              <input
                type="text"
                value={tempBio}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 70) setTempBio(value);
                }}
                className="flex-1 border rounded-md px-3 py-2 bg-background text-foreground outline-none"
                autoFocus
              />
              <button className="text-success" onClick={handleSaveBio}>
                <Check />
              </button>
              <button className="text-error" onClick={handleCancelEditBio}>
                <X />
              </button>
            </>
          ) : (
            <>
              <span className="text-base-content text-lg font-medium">{userProfile.bio}</span>
              <button onClick={() => setIsEditingBio(true)}>
                <Edit2 />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Last Login Section */}
      <div className="bg-base-200 rounded-xl p-4 shadow-md">
        <div className="mb-1 text-lg font-semibold text-base-content">Last Login</div>
        <p className="text-sm text-muted">Time of your last sign-in.</p>
        <div className="mt-3 text-base-content">
          {new Date(userProfile.lastLogin).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
