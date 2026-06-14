import { searchService } from "@/src/services/searchService"; // Ajuste o seu import do service
import { useLocalSearchParams, useRouter } from "expo-router";
import { Car, ChevronLeft, Layers } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    <SafeAreaView style={styles.container}>
      {/* 1. HEADER DE NAVEGAÇÃO FIXO (Sem o botão de ver produtos aqui!) */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#484848" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Soft Eletrônica {">"} Pesquisa</Text>
      </View>

      {/* 2. LISTA DE CATEGORIAS */}
      <FlatList
        data={categories}
        keyExtractor={(item, index) => `${item.categoriaId || index}-${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={(
          { item }, // <--- O 'item' nasce AQUI
        ) => (
          <View style={styles.card}>
            {/* Cabeçalho do Card */}
            <View style={styles.cardHeader}>
              {item.imgUrl ? (
                <Image
                  source={{ uri: item.imgUrl }}
                  style={styles.categoryIcon}
                />
              ) : (
                <Layers
                  size={28}
                  color="#484848"
                  style={styles.categoryIconFallback}
                />
              )}
              <Text style={styles.categoryName}>{item.name}</Text>
            </View>

            {/* Miolo do Card */}
            <View style={styles.cardBody}>
              <Car size={26} color="#484848" style={styles.carIcon} />
              <Text style={styles.carText}>
                {item.modelo} {item.ano}
              </Text>
            </View>

            {/* 3. O BOTÃO DEVE FICAR AQUI DENTRO (Onde o 'item' existe) */}
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: "/screens/productList" as any,
                  params: {
                    modelId: modeloId,
                    year: anoParam,
                    categoryId: String(item.categoriaId), // Agora o TS reconhece!
                  },
                });
              }}
            >
              <Text style={styles.actionButtonText}>VER MAIS</Text>
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
    backgroundColor: "#F5F5F7",
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
    fontSize: 16,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DFDFE7",
  },
  backButton: {
    marginRight: 12,
  },
  navTitle: {
    fontSize: 14,
    color: "#484848",
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DFDFE7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E2E2E9",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 36,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginRight: 14,
  },
  categoryIconFallback: {
    marginRight: 14,
  },
  categoryName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#333333",
    letterSpacing: 0.3,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  carIcon: {
    marginRight: 10,
  },
  carText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#484848",
    textTransform: "uppercase",
  },
  actionButton: {
    backgroundColor: "#1C61AC",
    paddingVertical: 12,
    marginHorizontal: 50,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 0.8,
  },
  emptyText: {
    textAlign: "center",
    color: "#A0A0AB",
    marginTop: 60,
    fontSize: 16,
  },
});
