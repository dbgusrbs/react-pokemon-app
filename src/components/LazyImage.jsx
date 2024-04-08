import React, { useEffect, useState } from 'react'

const LazyImage = ({ url, alt }) => {
  const [loading, setLoading] = useState(true);
  const [opacity, setOpacity] = useState('opacity-0');

  useEffect(() => {
    loading ? setOpacity('opacity-0') : setOpacity('opacity-100');
  }, [loading]);

  return (
    <>
      {loading && (
        <div className='absolute w-full h-full flex justify-center items-center text-zinc-500'>
          ...Loading
        </div>
      )}
      <img 
          src={url}
          alt={alt}
          width='100%'
          height='auto'
          loading='lazy'
          onLoad={() => setLoading(false)}
          className={`object-contain h-full ${opacity}`}
        />
    </>
  )
}

export default LazyImage