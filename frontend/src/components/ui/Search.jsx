import React from 'react'

const Search = ({searchValue,setSearchValue}) => {
  return (
    <div className='w-full p-2 rounded-md bg-gray-400 flex items-center'>
      <input type="text" placeholder="Search..." 
      value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      className="w-full p-2 border border-white rounded-md
      focus:outline-none text-gray-800
      " />
    </div>
  )
}

export default Search
