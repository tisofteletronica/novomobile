import { Tabs, usePathname, useRouter } from "expo-router";
import { Globe, MessageCircle, Search } from "lucide-react-native";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// IMPORTANTE: Adicionado para calcular a altura exata da barra de botões do celular
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScreensLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets(); // Obtém os recuos de segurança dinâmicos

  // FUNÇÕES DE DISPARO DOS LINKS
  function openWhatsApp() {
    Linking.openURL("https://wa.me/554135448500").catch((err) =>
      console.error("Erro ao abrir o WhatsApp:", err),
    );
  }

  function openWebsite() {
    Linking.openURL("https://www.softeletronica.com.br").catch((err) =>
      console.error("Erro ao abrir o site:", err),
    );
  }

  return (
    <Tabs
      tabBar={() => (
        <View
          style={[
            styles.tabBar,
            {
              // Soma o espaçamento nativo do celular ao padding inferior da nossa barra
              paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
              // Ajusta a altura total da barra dinamicamente para não esmagar os ícones
              height: insets.bottom > 0 ? 70 + insets.bottom : 70,
            },
          ]}
        >
          {/* 1. BOTÃO BUSCAR */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => router.push("/screens/SearchVehicle" as any)}
          >
            <Search
              size={24}
              color={pathname.includes("SearchVehicle") ? "#FC4C02" : "#484848"}
              strokeWidth={pathname.includes("SearchVehicle") ? 2.5 : 2}
            />
            <Text
              style={[
                styles.tabLabel,
                pathname.includes("SearchVehicle") && styles.tabLabelActive,
              ]}
            >
              Buscar
            </Text>
          </TouchableOpacity>

          {/* 2. BOTÃO HOME */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={openWebsite}
            activeOpacity={0.7}
          >
            <Globe size={24} color="#484848" />
            <Text style={styles.tabLabel}>Home</Text>
          </TouchableOpacity>

          {/* 3. BOTÃO SUPORTE */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={openWhatsApp}
            activeOpacity={0.7}
          >
            <MessageCircle size={24} color="#484848" />
            <Text style={styles.tabLabel}>Suporte</Text>
          </TouchableOpacity>
        </View>
      )}
      screenOptions={{
        headerShown: false,
        headerTintColor: "#484848",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 16,
        },
      }}
    >
      <Tabs.Screen
        name="screens/SearchVehicle"
        options={{ headerShown: false, title: "Pesquisa" }}
      />
      <Tabs.Screen
        name="screens/categoryList"
        options={{ headerShown: false, title: "Categorias" }}
      />
      <Tabs.Screen
        name="screens/productList"
        options={{ headerShown: false, title: "Produtos" }}
      />
      <Tabs.Screen
        name="screens/productDetails"
        options={{ headerShown: false, title: "Detalhes do Produto" }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DFDFE7",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 6,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
  },
  tabLabel: {
    fontSize: 12,
    color: "#484848",
    fontWeight: "600",
    marginTop: 4,
  },
  tabLabelActive: {
    color: "#FC4C02",
    fontWeight: "700",
  },
});
