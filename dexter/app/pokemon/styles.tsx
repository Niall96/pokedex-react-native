import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    container: {
        flex: 1, 
        backgroundColor: "#fff"    
    },
    scrollViewContainer: {
        flex: 1, 
        paddingBottom: 20
    },
    pokemonImage: {
        width: 200,
        height: 200,
        alignSelf: "center",
        marginVertical: 20,
        backgroundColor: '#D9DDDC',
        borderRadius: 20,
    },
    pokemonType: {
                    padding: 8,
                    marginVertical: 4,
                    marginHorizontal: 5,
                    borderRadius: 20,
                  },
    pokemonTypeText: { fontSize: 16, color: '#fff', paddingHorizontal: 10 },
    statsContainer: { marginTop: 16, marginBottom: 40 },
    labelTitle: { fontSize: 18, marginBottom: 8, color: '#818589' },
    statView: {                     flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 4},
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    gap: 8,
  },
  addButton: {
    backgroundColor: '#000000',
  },
  removeButton: {
    backgroundColor: '#FF0000',
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    position: 'relative',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusIcon: {
    position: 'absolute',
  },
})

export default styles