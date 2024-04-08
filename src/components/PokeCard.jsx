import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LazyImage from './LazyImage';
import { Link } from 'react-router-dom';

const PokeCard = ({ url, name }) => {
  const [pokemon, setPokemon] = useState();
  
  useEffect(() => {
    fetchPokeDetailData();
  }, [])
  
  async function fetchPokeDetailData() {
    const response = await axios.get(url);
    const pokemonData = formatPokemonData(response.data);
    setPokemon(pokemonData);
  }

  function formatPokemonData(params) {
    const { id, name, types } = params;
    const PokeData = {
      id,
      name,
      type: types[0].type.name
    }
    return PokeData;
  }

  const bg = `bg-${pokemon?.type}`;
  const border = `border-${pokemon?.type}`;
  const text = `text-${pokemon?.type}`;
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;

  return (
    <>
      {pokemon && 
        <Link 
          to={`/pokemon/${name}`}    
          className={`${border} rounded-lg w-[8.5rem] h-[8.5rem] bg-slate-800`}
        >
          <div
            className={`${text} text-xs h-[1.5rem] text-right p-1 px-1`}
          >
            #{pokemon.id.toString().padStart(3, '00')}
          </div>
          <div className='w-full flex justify-center items-center'>
            <div className='box-border relative w-full h-[5.5rem] basis flex justify-center items-center'>
              <LazyImage
                url={img}
                alt={name}
              />
            </div>
          </div>
          <div 
            className={`${bg} text-xs h-[1.5rem] rounded-b-lg text-center pt-1 uppercase text-gray-200`}
          >
            {pokemon.name}
          </div>
        </Link>
      }
    </>
  )
}

export default PokeCard