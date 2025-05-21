import React from 'react';
import Skeleton from '../ui/Skeleton';

const ProfileSkeleton = () => {
  return (
    <div className="h-full w-full flex flex-col bg-base-100 p-3">
      <div className="text-2xl font-semibold text-base-content mb-3">Profile</div>

      {/* Profile Picture */}
      <div className="flex justify-center items-center mb-3">
        <Skeleton className="rounded-full h-[180px] w-[180px]" />
      </div>

      {/* Name */}
      <div className="bg-base-200 rounded-lg shadow-sm p-3 mb-2">
        <Skeleton className="w-28 h-3 mb-1" />
        <Skeleton className="h-5 w-full" />
      </div>

      {/* Email */}
      <div className="bg-base-200 rounded-lg shadow-sm p-3 mb-2">
        <Skeleton className="w-20 h-3 mb-1" />
        <Skeleton className="h-5 w-full" />
      </div>

      {/* Bio */}
      <div className="bg-base-200 rounded-lg shadow-sm p-3 mb-2">
        <Skeleton className="w-16 h-3 mb-1" />
        <Skeleton className="h-5 w-full" />
      </div>

      {/* Last Login */}
      <div className="bg-base-200 rounded-lg shadow-sm p-3 mb-2">
        <Skeleton className="w-24 h-3 mb-1" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
