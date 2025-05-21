import React from 'react'

const Search = ({ searchValue, setSearchValue }) => {
  return (
    <div className='w-full p-2 rounded-md bg-base-200 flex items-center'>
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full p-2 border border-base-300 rounded-md focus:outline-none text-base-content bg-base-100"
      />
    </div>
  )
}

export default Search
