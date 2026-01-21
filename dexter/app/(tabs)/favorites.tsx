import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FAVORITES_KEY = "@pokedex_favorites";

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pokemon, setPokemon] = useState<any[]>([]);

  const loadAndFetchFavorites = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      let favoriteIds: string[] = [];

      if (stored) {
        favoriteIds = JSON.parse(stored);
      }

      setFavorites(favoriteIds);

      if (favoriteIds.length === 0) {
        setPokemon([]);
        return;
      }

      const pokemonPromises = favoriteIds.map((id) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then((res) => res.json())
          .then((data) => ({
            id: data.id.toString(),
            name: data.name,
            url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
          }))
          .catch((error) => {
            console.error(`Error fetching Pokemon ${id}:`, error);
            return null;
          })
      );

      const results = await Promise.all(pokemonPromises);
      setPokemon(results.filter((p) => p !== null));
    } catch (error) {
      console.error("Error loading favorites:", error);
      setPokemon([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAndFetchFavorites();
    }, [loadAndFetchFavorites])
  );


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Favorites</Text>
          {pokemon.length > 0 && (
            <Text style={styles.headerCount}>{pokemon.length} Pokémon</Text>
          )}
        </View>
      </View>

      {pokemon.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Add Pokémon to your favorites to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={pokemon}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => router.push(`/pokemon/${item.id}`)}
                style={styles.pokemonItem}
              >
                <Text style={styles.pokemonName}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#000000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerCount: {
    fontSize: 14,
    color: "#CCCCCC",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  pokemonItem: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginVertical: 0,
    marginHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pokemonName: {
    fontSize: 18,
    color: "#000000",
  },
});
