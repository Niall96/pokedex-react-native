import { API_BASE_URL } from "../utils/apiConfig";
import { PokemonData } from "./interfaces/pokemonInterface";

type PokemonType = {
  name: string;
  url: string;
};

type PokemonTypeListResponse = {
  results: PokemonType[];
};

type PokemonListItem = {
  name: string;
  url: string;
  id: string;
};

type TypeResponse = {
  pokemon: {
    pokemon: {
      name: string;
      url: string;
    };
  }[];
};

const extractIdFromUrl = (url: string): string => {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
};

export async function getPokemonById(id: string | string[]): Promise<PokemonData> {
  const pokemonId = Array.isArray(id) ? id[0] : id;
  const response = await fetch(`${API_BASE_URL}pokemon/${pokemonId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${response.statusText}`);
  }

  return response.json();
}


