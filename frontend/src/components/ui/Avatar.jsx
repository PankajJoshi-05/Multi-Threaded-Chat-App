import React from 'react'

const Avatar = ({src,alt}) => {
  return (
    <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
        {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500 font-bold text-3xl">
            <span>{ alt.charAt(0).toUpperCase() }</span>
            </div>
        )}
    </div>
  )
}

export default Avatar;
