import React from 'react'

const Avatar = ({src,alt}) => {
  return (
    <>
        {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
             <div className="flex items-center justify-center w-full h-full bg-accent text-accent-content font-bold text-2xl">
          <span>{(alt && alt.charAt(0).toUpperCase()) || '?'}</span>
           </div>
        )}
    </>
  )
}

export default Avatar;
