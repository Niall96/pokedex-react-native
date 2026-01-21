import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const router = useRouter();
  const { favorites, loadFavorites, removeFavorite } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleRemove = async (id: string, e: any) => {
    e.stopPropagation();
    await removeFavorite(id);
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Favorites</Text>
          {favorites.length > 0 && (
            <Text style={styles.headerCount}>{favorites.length} Pokémon</Text>
          )}
        </View>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => router.push(`/pokemon/${item.id}`)}
                style={styles.pokemonCard}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.pokemonImage}
                />
                <Text style={styles.pokemonName}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={(e) => handleRemove(item.id, e)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
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
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  pokemonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pokemonImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  pokemonName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
