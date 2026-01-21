import { API_BASE_URL } from "../utils/apiConfig";
import { PokemonType, PokemonTypeListResponse, PokemonListItem, PokemonListResponse } from "./types/pokemonTypes";

const extractIdFromUrl = (url: string): string => {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  };

export async function fetchTypes(): Promise<PokemonType[]> {
    const response = await fetch(`${API_BASE_URL}type`);

    if (!response.ok) {
        throw new Error(`Failed to fetch types: ${response.statusText}`);
    }

    const data = (await response.json()) as PokemonTypeListResponse;
    return data.results.filter((t) => t.name !== "unknown" && t.name !== "shadow");
}

export async function fetchPokemonByType(typeName: string): Promise<PokemonListItem[]> {
    const response = await fetch(`${API_BASE_URL}type/${typeName}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon by type: ${response.statusText}`);
    }

    const data = (await response.json()) as PokemonListResponse;
    console.log(data.pokemon);
    return data.pokemon.map((entry) => ({
        ...entry.pokemon,
        id: extractIdFromUrl(entry.pokemon.url),
    }));
}
