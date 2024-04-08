import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import PokeCard from '../../components/PokeCard';
import AutoComplete from '../../components/AutoComplete';

const MainPage = () => {
  // 모든 포켓몬 데이터를 가지고 있는 State
  const [allPokemons, setAllPokemons] = useState([]);

  // 실제로 리스트로 보여주는 포켓몬 데이터를 가지고 있는 State
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  // 한번에 보여주는 포켓몬 수
  const limitNum = 20;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008}&offset=0`;
  
  useEffect(() => {
    fetchPokeData();
  }, []);

  const filterDisplayedPokemonData = (allPokemonsData, setDisplayedPokemons = []) => {
    const limit = setDisplayedPokemons.length + limitNum;
    const array = allPokemonsData.filter((pokemon, index) => index + 1 <= limit);
    return array;
  }
  
  
  const fetchPokeData = async () => {
    try {
      // 1008개 포켓몬 데이터 받아오기
      const response = await axios.get(url);
      setAllPokemons(response.data.results);
      setDisplayedPokemons(filterDisplayedPokemonData(response.data.results));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <article className='pt-6'>
      <header className='flex flex-col w-full gap-2 px-4 z-50'>
        <AutoComplete
          allPokemons={allPokemons}
          setDisplayedPokemons={setDisplayedPokemons}
        />
      </header>
      <section className='pt-6 flex flex-col justify-center items-center z-0'>
        <div className='flex flex-row flex-wrap gap-[16px] max-w-4xl px-2 justify-center items-center'>
          {displayedPokemons.length > 0 ? 
          (
            displayedPokemons.map(({ url, name }, index) => (
              <PokeCard
                key={name}
                url={url}
                name={name}
              />
            ))
          ) : (
            <h2>
              포켓몬이 없습니다.
            </h2>
          )}
        </div>
      </section>
      <div className='text-center'>
        {(allPokemons.length > displayedPokemons.length) && (displayedPokemons.length !== 1) && (
          <button 
            onClick={() => setDisplayedPokemons(filterDisplayedPokemonData(allPokemons, displayedPokemons))}
            className='bg-slate-800 px-6 py-2 my-4 text-gray-200 rounded-lg hover:bg-slate-700'
          >
            더 보기
          </button>
        )}
      </div>
    </article>
  )
}

export default MainPage