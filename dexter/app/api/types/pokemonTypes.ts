export type PokemonType = {
    name: string;
    url: string;
};

export type PokemonTypeListResponse = {
    results: PokemonType[];
};

export type PokemonListItem = {
    name: string;
    url: string;
    id: string;
};

export type PokemonListResponse = {
    pokemon: {
        pokemon: {
            id: string;
            name: string;
            url: string;
        };
    }[];
};