import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../styles/global.css";

// Mantém a Splash Screen nativa visível enquanto as rotas e estilos carregam
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  useEffect(() => {
    // Assim que o layout monta e está pronto, liberamos a Splash instantaneamente
    async function hideSplash() {
      await SplashScreen.hideAsync();
    }

    hideSplash();
  }, []);

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#F5F5F7" },
        headerTintColor: "#484848",
        headerBackTitle: "Voltar",
        // Deixa o visual do cabeçalho mais limpo e profissional no mobile
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 16,
        },
      }}
    >
      {/* Tela de Busca Inicial */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Listagem de Categorias do Veículo */}
      <Stack.Screen
        name="screens/categoryList"
        options={{ title: "Categorias" }}
      />

      {/* Listagem de Produtos */}
      <Stack.Screen
        name="screens/productList"
        options={{ title: "Produtos" }}
      />

      {/* Detalhes Técnicos e Manuais do Produto */}
      <Stack.Screen
        name="screens/productDetails"
        options={{ title: "Detalhes do Produto" }}
      />
    </Stack>
  );
}
