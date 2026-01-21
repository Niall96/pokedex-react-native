import { useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { typeColors } from "../utils/TypeColor";
import * as Progress from 'react-native-progress';
import { useFavorites } from "../context/FavoritesContext";
import { Circle } from "lucide-react-native";
import styles from "./styles";
import formatStatName from "../utils/formatStatName";
import { getPokemonById } from "../api/pokemonApi";


export default function PokemonDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const [pokemonData, setPokemonData] = useState<any>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const data = await getPokemonById(id);
        navigation.setOptions({
          title: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          headerBackTitleVisible: false,
        });
        setPokemonData(data);
      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      }
    }
    fetchDetail();
  }, [id, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        setFavorite(isFavorite(id as string));
      }
    }, [id, isFavorite])
  );


  const handleFavoriteToggle = async () => {
    if (!pokemonData || !id) return;

    if (favorite) {
      await removeFavorite(id as string);
      setFavorite(false);
    } else {
      await addFavorite({
        id: id as string,
        name: pokemonData.name,
        imageUrl: pokemonData.sprites.front_default,
      });
      setFavorite(true);
    }
  };

  if (!pokemonData) return null;

  const progressBarWidth = Math.max(0, windowWidth - 16 * 2 - 8 * 2);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContainer}>
        <View style={{ padding: 16 }}>
          <Image
            source={{ uri: pokemonData.sprites.front_default }}
            style={styles.pokemonImage}
          />

          <View style={{ marginTop: 16 }}>
            <Text style={styles.labelTitle}>
              Types
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {pokemonData.types.map((t: any) => (
                <View
                  key={t.type.name}
                  style={[styles.pokemonType,
                  { backgroundColor: typeColors[t.type.name] }
                  ]}
                >
                  <Text style={styles.pokemonTypeText}>
                    {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.labelTitle}>
              Stats
            </Text>
            {pokemonData.stats.map((s: any) => (
              <View key={s.stat.name} style={{ padding: 8 }}>
                <View
                  style={styles.statView}
                >
                  <Text style={{ fontSize: 16, flex: 1 }}>
                    {formatStatName(s.stat.name)}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {s.base_stat}
                  </Text>
                </View>
                <Progress.Bar progress={s.base_stat / 255} color="#000" width={progressBarWidth} />
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            favorite ? styles.removeButton : styles.addButton,
          ]}
          onPress={handleFavoriteToggle}
        >
          {favorite ? (
            <>
              <View style={styles.iconContainer}>
                <Circle size={18} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
              </View>
              <Text style={styles.favoriteButtonText}>Remove from Favorites</Text>
            </>
          ) : (
            <>
              <Circle size={20} color="#FFFFFF" strokeWidth={2} fill="none" />
              <Text style={styles.favoriteButtonText}>Add to Favorites</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>


    </View>
  );
}
