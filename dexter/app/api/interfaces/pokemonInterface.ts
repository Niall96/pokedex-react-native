export interface PokemonData {
    name: string;
    sprites: {
      front_default: string;
    };
    types: Array<{
      type: {
        name: string;
      };
    }>;
    stats: Array<{
      stat: {
        name: string;
      };
      base_stat: number;
    }>;
  }