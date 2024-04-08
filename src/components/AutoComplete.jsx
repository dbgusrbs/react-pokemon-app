import React, { useState } from 'react'

const AutoComplete = ({ allPokemons, setDisplayedPokemons }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterNames = (input) => {
    const value = input.toLowerCase();
    return value ? allPokemons.filter((e) => e.name.includes(value)) : [];
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let text = searchTerm.trim();
    setDisplayedPokemons(filterNames(text));
    setSearchTerm('');
  }

  const checkEqualName = (input) => {
    const filteredArray = filterNames(input);
    return filteredArray[0]?.name === input ? [] : filteredArray;
  }

  return (
    <div className='relative z-50'>
      <form  
        onSubmit={handleSubmit}
        className='relative flex justify-center items-center w-[20.5rem] h-6 m-auto'
      >
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='text-xs w-full h-full px-2 py-1 bg-[hsl(214,13%,47%)] rounded-lg text-gray-300 text-center'
        />
        <button
          type='submit'
          className='bg-slate-800 text-white w-[2.5rem] h-6 text-xs absolute right-0 rounded-r-lg hover:bg-slate-700'
        >
          검색
        </button>
      </form>
      {checkEqualName(searchTerm).length > 0 && (
        <div
          className='w-full flex bottom-0 h-0 flex-col absolute justify-center items-center translate-y-2'
        >
          <div
            className='w-0 h-0 bottom-0 border-x-transparent border-x-8 border-b-[8px] border-gray-700 -translate-y-1/2'
          >
          </div>
          <ul
            className='w-40 max-h-[134px] py-1 bg-gray-700 rounded-lg absolute top-0 overflow-auto scrollbar-none'
          >
            {checkEqualName(searchTerm).map((e,i) => (
              <li key={`button-${i}`}>
                <button
                  onClick={() => setSearchTerm(e.name)}
                  className='text-base w-full text-gray-100 p-[2px] hover:bg-gray-600'
                >
                  {e.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AutoComplete