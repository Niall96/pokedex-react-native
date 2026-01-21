import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ListFilter, ChevronRight } from "lucide-react-native";
import { typeColors } from "../utils/TypeColor";
import { fetchTypes as fetchTypesApi, fetchPokemonByType as fetchPokemonByTypeApi } from "../api/typesApi";
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";


export default function Index() {
  const router = useRouter();
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(
    "https://pokeapi.co/api/v2/pokemon/?limit=20"
  );
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [filteredMode, setFilteredMode] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const fetchPokemon = useCallback(async (url: string) => {
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch Pokemon");
      }
      const data = await res.json();

      const pokemonWithIds = data.results.map((item: any) => ({
        ...item,
        id: item.id,
      }));

      setPokemon((prevPokemon) => {
        const combined = [...prevPokemon, ...pokemonWithIds];
        const seen = new Set<string>();
        return combined.filter((p) => {
          const key = p?.id ?? p?.url ?? p?.name;
          if (!key) return true;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });

      if (data.results.length < 20 || !data.next) {
        setNextUrl(null);
      } else {
        setNextUrl(data.next);
      }
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
      Alert.alert("Oops", "Please try again");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTypes = useCallback(async () => {
    try {
      const validTypes = await fetchTypesApi();
      setTypes(validTypes);
    } catch (error) {
      console.error("Error fetching types:", error);
      Alert.alert("Oops", "Please try again");
    }
  }, []);

  const fetchPokemonByType = useCallback(async (typeName: string) => {
    setLoading(true);
    try {
      const pokemonList = await fetchPokemonByTypeApi(typeName);
      setPokemon(pokemonList);
      setFilteredMode(true);
      setNextUrl(null);
    } catch (error) {
      console.error("Error fetching Pokemon by type:", error);
      Alert.alert("Oops", "Please try again");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialUrl = "https://pokeapi.co/api/v2/pokemon/?limit=20";
    fetchPokemon(initialUrl);
    fetchTypes();
  }, [fetchPokemon, fetchTypes]);

  const loadMore = useCallback(() => {
    if (nextUrl && !loading && !filteredMode) {
      fetchPokemon(nextUrl);
    }
  }, [nextUrl, loading, fetchPokemon, filteredMode]);

  const handleTypeSelect = (typeName: string | null) => {
    if (typeName === null || selectedType === typeName) {
      setSelectedType(null);
      setFilteredMode(false);
      setPokemon([]);
      setNextUrl("https://pokeapi.co/api/v2/pokemon/?limit=20");
      const initialUrl = "https://pokeapi.co/api/v2/pokemon/?limit=20";
      fetchPokemon(initialUrl);
    } else {
      setSelectedType(typeName);
      setPokemon([]);
      fetchPokemonByType(typeName);
    }
    setFilterMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Pokédex</Text>
          {pokemon.length > 0 && selectedType != null && (
            <Text style={styles.headerCount}>{pokemon.length} Pokémon</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setFilterMenuVisible(!filterMenuVisible)}
          style={styles.filterButton}
        >
          <ListFilter color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={filterMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.filterDropdown}>
                <TouchableOpacity
                  onPress={() => handleTypeSelect(null)}
                  style={[
                    styles.filterOption,
                    !selectedType && styles.filterOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      !selectedType && styles.filterOptionTextSelected,
                    ]}
                  >
                    All Types
                  </Text>
                </TouchableOpacity>
                {types.map((type) => {
                  const isSelected = selectedType === type.name;
                  const typeColor = typeColors[type.name] || "#A8A878";
                  return (
                    <TouchableOpacity
                      key={type.name}
                      onPress={() => handleTypeSelect(type.name)}
                      style={[
                        styles.filterOption,
                        isSelected && styles.filterOptionSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.typeIndicator,
                          { backgroundColor: typeColor },
                        ]}
                      />
                      <Text
                        style={[
                          styles.filterOptionText,
                          isSelected && styles.filterOptionTextSelected,
                        ]}
                      >
                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <FlatList
        data={pokemon}
        keyExtractor={(item) => item.id?.toString() ?? item.name}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (item.id) router.push(`/pokemon/${item.id}`);
              }}
              style={styles.pokemonItem}
            >
              <Text style={styles.pokemonName}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Text>
              <ChevronRight />
            </TouchableOpacity>
          );
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
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
  filterButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "flex-end",
    paddingTop: 82,
    paddingRight: 16,
  },
  filterDropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterOptionSelected: {
    backgroundColor: "#F0F0F0",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333333",
    marginLeft: 8,
  },
  filterOptionTextSelected: {
    fontWeight: "600",
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
