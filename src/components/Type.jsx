import React from 'react'

const Type = ({ type, damageValue }) => {
  
  const bg = `bg-${type}`;

  return (
    <div className={`h-[1.5rem] ${bg} px-3 py-1 rounded-2xl font-bold text-zinc-800 text-[0.7rem] leading-[0.8rem] capitalize flex items-center justify-center gap-1`}>
      <span>{type}</span>
      {damageValue && (
        <span className='bg-zinc-200/40 p-[.125rem] rounded'>
          {damageValue}
        </span>
      )}
    </div>
  )
}

export default Type