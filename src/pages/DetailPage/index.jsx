import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Loading } from '../../assets/Loading';
import { LessThan } from '../../assets/LessThan';
import { GreaterThan } from '../../assets/GreaterThan';
import { ArrowLeft } from '../../assets/ArrowLeft';
import { Balance } from '../../assets/Balance';
import { Vector } from '../../assets/Vector';
import Type from '../../components/Type';
import BaseStat from '../../components/BaseStat';
import DamageModal from '../../components/DamageModal';

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const pokemonId = params.id;
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;
  
  useEffect(() => {
    setLoading(true);
    fetchPokemonData(pokemonId);
  }, [pokemonId]);
  

  async function fetchPokemonData(id) {
    const url = `${baseUrl}${id}`;

    try {
      const { data: pokemonData } = await axios.get(url);

      if (pokemonData) {
        const { id, name, types, weight, height, stats, abilities, sprites } = pokemonData;

        const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get(i.type.url);
            return type.data.damage_relations;
          })
        )

        const formattedPokemonData = {
          id,
          name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonStats(stats),
          DamageRelations,
          types: types.map(type => type.type.name),
          sprites: formatPokemonSprites(sprites),
          descrpition: await getPokemonDescription(id)
        }
        console.log(formattedPokemonData)

        setPokemon(formattedPokemonData);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const filterAndFormatDescription = (flavorText) => {
    const koreanDescriptions = flavorText
      ?.filter((text) => text.language.name === 'ko')
      .map((text) => text.flavor_text.replace(/\r|\n|\f/g, ''))

    return koreanDescriptions;
  }

  const getPokemonDescription = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const { data: pokemonSpecies } = await axios.get(url);
    console.log(pokemonSpecies)

    const descriptions = filterAndFormatDescription(pokemonSpecies.flavor_text_entries);

    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  const formatPokemonSprites = (sprites) => {
    const newSprites = { ...sprites };

    (Object.keys(newSprites).forEach(key => {
      if (typeof newSprites[key] !== 'string') {
          delete newSprites[key];
      }
    }));

    return Object.values(newSprites)
  }

  const formatPokemonStats = ([
    statHP,
    statATK,
    statDEF,
    statSATK,
    statSDEF,
    statSPD
  ]) => [
    { name: 'Hit Points', baseStat: statHP.base_stat },
    { name: 'Attack', baseStat: statATK.base_stat },
    { name: 'Defense', baseStat: statDEF.base_stat },
    { name: 'Special Attack', baseStat: statSATK.base_stat },
    { name: 'Special Defense', baseStat: statSDEF.base_stat },
    { name: 'Speed', baseStat: statSPD.base_stat },
  ]
  
  const formatPokemonAbilities = (abilities) => {
    return abilities.filter((_,index) => index <= 1)
                    .map((obj) => obj.ability.name.replaceAll('-', ' '))
  }
  
  async function getNextAndPreviousPokemon(id) {
    const pokemonUrl = `${baseUrl}?limit=1&offset=${id - 1}`;
    const { data: pokemonData } = await axios.get(pokemonUrl);
    const nextResponse = pokemonData.next && (await axios.get(pokemonData.next));
    const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous));

    return {
      next: nextResponse?.data?.results?.[0]?.name,
      previous: previousResponse?.data?.results?.[0]?.name,
    }
  }

  if(loading) {
    return (
      <div className='absolute w-auto h-auto top-1/3 left-1/2 -translate-x-1/2 z-50'>
        <Loading
          className='w-12 h-12 animate-spin text-slate-900 z-50'
        />
      </div>
    )
  }

  if(!loading && !pokemon) {
    return (
      <div>...NOT FOUND</div>
    )
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`
  const text = `text-${pokemon?.types?.[0]}`

  return (
    <article className='flex flex-col items-center gap-1 w-full'>
      <div
        className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
      >
        {pokemon.previous && (
          <Link
            className='absolute top-[40%] -translate-y-1/2 left-1 z-50'
            to={`/pokemon/${pokemon.previous}`}
          >
            <LessThan
              className='w-5 h-8 p-1'
            />
          </Link>
        )}
        {pokemon.next && (
          <Link
            className='absolute top-[40%] -translate-y-1/2 right-1 z-50'
            to={`/pokemon/${pokemon.next}`}
          >
            <GreaterThan
              className='w-5 h-8 p-1'
            />
          </Link>
        )}

        <section className='w-full h-full flex flex-col z-20 items-center justify-end relative'>
          <div className='absolute z-30 w-full top-6 flex items-center justify-between px-2'>
            <div className='flex items-center gap-1'>
              <Link
                to='/'
              >
                <ArrowLeft className='w-6 h-8 text-zinc-100'/>
              </Link>
              <h1 className='text-zinc-100 text-xl font-bold capitalize'>
                {pokemon.name}
              </h1>
            </div>
            <div className='text-zinc-100 font-bold text-md'>
              #{pokemon.id.toString().padStart(3, '00')}
            </div>
          </div>

          <div className='relative max-w-[15.5rem] h-auto z-20 mt-6 -mb-16'>
            <img 
              src={img} 
              alt={pokemon.name}
              width='100%'
              height='auto'
              loading='lazy'
              className='object-contain h-full'
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </section>

        <section className='w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4'>
          <div className='flex items-center justify-center gap-4'>
            {/* 포켓몬 타입 */}
            {pokemon.types.map((type)=> (
              <Type
                key={type}
                type={type}
              />
            ))}
          </div>

          <h2 className={`text-base font-semibold ${text}`}>
            정보
          </h2>

          <div className='flex w-full items-center text-center max-w-[400px] justify-between'>
            <div className='w-full'>
              <h4 className='text-[0.6rem] text-zinc-100'>Wight</h4>
              <div className='text-sm flex mt-1 gap-2 justify-center text-zinc-100'>
                <Balance/>
                {pokemon.weight}kg
              </div>
            </div>
            <div className='w-full'>
              <h4 className='text-[0.6rem] text-zinc-100'>Wight</h4>
              <div className='text-sm flex mt-1 gap-2 justify-center text-zinc-100'>
                <Vector/>
                {pokemon.height}m
              </div>
            </div>
            <div className='w-full'>
              <h4 className='text-[0.6rem] text-zinc-100'>Wight</h4>
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability}
                  className='text-[0.7rem] text-zinc-100 capitalize'
                >
                  {ability}
                </div>
              ))}
            </div>
          </div>

          <h2 className={`text-base font-semibold ${text}`}>
            기본 능력치
          </h2>
          <div className='w-full'>
            <table className='flex justify-center'>
              <tbody>
                {pokemon.stats.map((stat) => (
                  <BaseStat
                    key={stat.name}
                    valueStat={stat.baseStat}
                    nameStat={stat.name}
                    type={pokemon.types[0]}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <h2 className={`text-base font-semibold ${text}`}>
            설명
          </h2>
          <p className='text-md leading-7 font-sans text-zinc-200 max-w-[30rem] text-center'>
            {pokemon.descrpition}
          </p>

          <div className='flex my-8 flex-wrap justify-center'>
            {pokemon.sprites.map((url, index) => (
              <img 
                key={index}
                src={url}
                alt='sprites'
              />
            ))}
          </div>
        </section>

        
      </div>
      {isModalOpen && <DamageModal 
        setIsModalOpen={setIsModalOpen} 
        damages={pokemon.DamageRelations} 
      />}
    </article>
  )
}

export default DetailPage