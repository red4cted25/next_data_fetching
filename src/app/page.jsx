"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

const PokemonBoxViewer = () => {
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boxNumber, setBoxNumber] = useState(1);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        // Calculate offset based on box number (30 Pokémon per box)
        const offset = (boxNumber - 1) * 30;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=30&offset=${offset}`);
        const data = await response.json();
        
        // Fetch details for each Pokémon
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const pokemonData = await res.json();
            
            // Generate random level between 1 and 100
            const randomLevel = Math.floor(Math.random() * 100) + 1;
            
            return {
              ...pokemonData,
              level: randomLevel
            };
          })
        );
        
        setPokemon(pokemonDetails);
      } catch (error) {
        console.error("Failed to fetch Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [boxNumber]);

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleClosePanel = () => {
    setSelectedPokemon(null);
  };

  const navigateBox = (direction) => {
    if (direction === 'next' && boxNumber < 30) {
      setBoxNumber(boxNumber + 1);
    } else if (direction === 'prev' && boxNumber > 1) {
      setBoxNumber(boxNumber - 1);
    }
  };

  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    
    return typeColors[type] || '#68A090';
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-center h-screen bg-primary-dark font-poke">
      {/* Pokémon Detail Panel */}
      {selectedPokemon && (
        // Panel BG
        <div className="md:w-1/4 bg-secondary rounded-lg p-4 shadow-lg">
          {/* Name and X */}
          <section className="flex justify-between items-center p-2 mb-3 border-6 border-secondary-dark outline-4 outline-black rounded-lg">
            <div className="text-lg font-bold">
              {selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}
            </div>
            <button 
              onClick={handleClosePanel}
              className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex justify-center items-center hover:bg-red-600"
            >
              X
            </button>
          </section>
          
          {/* Image */}
          <section className="border-6 border-secondary-dark outline-4 outline-black rounded-lg p-2 mb-4">
            <img 
              src={selectedPokemon.sprites.front_default} 
              alt={selectedPokemon.name}
              className="w-full h-32 object-contain"
            />
          </section>
          
          {/* Details Section */}
          <section className="border-6 border-secondary-dark outline-4 outline-black rounded-lg p-1">
            {/* # and Lvl */}
            <section className="flex justify-between gap-2 border-2 border-secondary-shadow rounded-lg p-2 mb-4">
              <div className="w-1/2">
                <div className="text-xs">No.</div>
                <div>{selectedPokemon.id}</div>
              </div>
              <div className="w-1/2">
                <div className="text-xs">Level</div>
                <div>{selectedPokemon.level}</div>
              </div>
            </section>
            
            {/* Types */}
            <section className="border-2 border-secondary-shadow rounded-lg p-2 mb-4">
              <div className="flex gap-2">
                {selectedPokemon.types.map((typeInfo) => (
                  <div 
                    key={typeInfo.type.name}
                    className="px-2 py-1 rounded text-white text-xs w-1/2"
                    style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
                  >
                    {typeInfo.type.name.toUpperCase()}
                  </div>
                ))}
              </div>
            </section>
            
            {/* Abilities */}
            <section className="border-2 border-secondary-shadow rounded-lg p-2 mb-4">
              <div className="text-xs mb-1 text-gray-500">Abilities</div>
              <div className="p-2">
                {selectedPokemon.abilities.map((abilityInfo, index) => (
                  <div key={abilityInfo.ability.name} className="text-xs">
                    {abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1)}
                    {abilityInfo.is_hidden && " (Hidden)"}
                  </div>
                ))}
              </div>
            </section>
            
            {/* Characteristics */}
            <section className="flex justify-content gap-2 border-2 border-secondary-shadow rounded-lg p-2 mb-4">
              <div className="w-1/2">
                <div className="text-xs text-gray-500">Height</div>
                <div>{selectedPokemon.height / 10} m</div>
              </div>
              <div className="w-1/2">
                <div className="text-xs text-gray-500">Weight</div>
                <div>{selectedPokemon.weight / 10} kg</div>
              </div>
            </section>
          </section>
        </div>
      )}

      {/* Pokémon Selection Panel */}
      <div className="md:w-3/4 bg-blue-500 rounded-lg p-4 md:mr-4 mb-4 md:mb-0 shadow-lg">
        <div className="bg-blue-600 rounded-lg p-2 mb-4 flex justify-between items-center">
          <button 
            onClick={() => navigateBox('prev')} 
            className="bg-secondary border-4 border-black rounded-md px-2 py-1 text-xl"
            disabled={boxNumber === 1}
          >
            ◀
          </button>
          <div className="bg-green-100 rounded px-4 py-1 text-center font-bold">
            Box {boxNumber}
          </div>
          <button 
            onClick={() => navigateBox('next')} 
            className="bg-secondary border-4 border-black rounded-md px-2 py-1 text-xl"
            disabled={boxNumber === 30}
          >
            ▶
          </button>
        </div>
        
        {/* Loading Function */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-bounce rounded-full w-16 h-16 flex items-center justify-center">
              <Image 
                src="https://res.cloudinary.com/drnaycy06/image/upload/v1741056684/image-removebg-preview_p1a6oh.png" 
                alt="Loading..." 
                width={64} 
                height={64}
                className='animate-wiggle'
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 bg-green-200 p-2 rounded-lg">
            {pokemon.map((mon) => (
              <div 
                key={mon.id} 
                className="bg-green-100 rounded-lg p-2 hover:bg-green-300 cursor-pointer transition-all"
                onClick={() => handlePokemonSelect(mon)}
              >
                <img 
                  src={mon.sprites.front_default} 
                  alt={mon.name}
                  className="w-full h-16 object-contain"
                />
                <div className="text-xs text-center truncate">
                  {mon.name.charAt(0).toUpperCase() + mon.name.slice(1)}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <button className="bg-secondary border-4 border-black rounded-md px-4 py-2 text-3xl">ROAR</button>
          <button className="bg-secondary border-4 border-black rounded-md px-4 py-2 text-3xl" onClick={() => setBoxNumber(1)}>RETURN</button>
        </div>
      </div>
    </div>
  );
};

export default PokemonBoxViewer;