import { Stack } from "expo-router";
import { FavoritesProvider } from "./context/FavoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="pokemon/[id]"
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#000000",
            },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerBackButtonDisplayMode: "minimal",
          }}
        />
      </Stack>
    </FavoritesProvider>
  );
}
