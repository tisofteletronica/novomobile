import { searchService } from "@/src/services/searchService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Car, ChevronLeft, Layers } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryList() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const modeloId = String(params.modelId);
  const anoParam = String(params.year);

  useEffect(() => {
    if (modeloId && anoParam) {
      searchService
        .getCategoryByModelAndYear(modeloId, anoParam)
        .then((data) => {
          const list = Array.isArray(data) ? data : data.content || [];
          setCategories(list);
        })
        .catch((err) => console.error("Erro ao buscar categorias:", err))
        .finally(() => setLoading(false));
    }
  }, [modeloId, anoParam]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FC4C02" />
        <Text style={styles.loadingText}>Buscando categorias...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER PADRONIZADO DA MARCA */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* SUB-HEADER APENAS COM O BOTÃO VOLTAR (MIGALHAS REMOVIDAS) */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.6}
        >
          <ChevronLeft size={20} color="#FC4C02" strokeWidth={3} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE CATEGORIAS */}
      <FlatList
        data={categories}
        keyExtractor={(item, index) => `${item.categoriaId || index}-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {item.imgUrl ? (
                <Image
                  source={{ uri: item.imgUrl }}
                  style={styles.categoryIcon}
                />
              ) : (
                <Layers
                  size={24}
                  color="#1C61AC"
                  style={styles.categoryIconFallback}
                />
              )}
              <Text style={styles.categoryName}>{item.name}</Text>
            </View>

            <View style={styles.cardBody}>
              <Car size={20} color="#74747A" style={styles.carIcon} />
              <Text style={styles.carText}>
                {item.modelo} {item.ano}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: "/screens/productList" as any,
                  params: {
                    modelId: modeloId,
                    year: anoParam,
                    categoryId: String(item.categoriaId),
                  },
                });
              }}
            >
              <Text style={styles.actionButtonText}>VER PRODUTOS</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF1F8",
  },
  center: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#484848",
    fontSize: 15,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 180,
    height: 48,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Garante o botão alinhado à esquerda
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DFDFE7",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E4ED",
  },
  backButtonText: {
    fontSize: 13,
    color: "#484848",
    fontWeight: "700",
    marginLeft: 2,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DFDFE7",
    shadowColor: "#1C61AC",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F7FB",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF1F8",
  },
  categoryIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
    marginRight: 12,
  },
  categoryIconFallback: {
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#252429",
    letterSpacing: 0.3,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  carIcon: {
    marginRight: 8,
  },
  carText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#74747A",
  },
  actionButton: {
    backgroundColor: "#1C61AC",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#1C61AC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 1.2,
  },
});
