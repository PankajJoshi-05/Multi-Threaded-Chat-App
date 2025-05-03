import React from 'react'

const Avatar = ({src,alt}) => {
  return (
    <>
        {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500 font-bold text-3xl">
            <span>{(alt && alt.charAt(0).toUpperCase()) || '?'}</span>
            </div>
        )}
    </>
  )
}

export default Avatar;
