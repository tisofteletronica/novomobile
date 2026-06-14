import { searchService } from "@/src/services/searchService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
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

// IMPORTAÇÃO CORRETA DA ÁREA SEGURA CORRIGINDO O ALERTA DO TERMINAL
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductList() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const model = String(params.modelId);
  const year = String(params.year);
  const category = String(params.categoryId);

  useEffect(() => {
    if (model && year && category) {
      searchService
        .getProductsByModelAndCategory(model, year, category)
        .then((data) => {
          const list = Array.isArray(data) ? data : data.content || [];
          setProducts(list);
        })
        .catch((err) => console.error("Erro ao buscar produtos:", err))
        .finally(() => setLoading(false));
    }
  }, [model, year, category]);

  function createExcerpt(text: string, limit: number) {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FC4C02" />
        <Text style={styles.loadingText}>Buscando produtos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 1. HEADER PADRONIZADO COM A LOGO DA MARCA */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* 2. SUB-HEADER LIMPO APENAS COM O BOTÃO DE VOLTAR CAPSULA */}
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

      {/* 3. LISTA DE PRODUTOS */}
      <FlatList
        data={products}
        keyExtractor={(item, index) => `${item.id || index}-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (!item) return null;

          const qtdConvencional = Number(item.vidroConvencional) || 0;
          const qtdInteligente = Number(item.vidroInteligente) || 0;

          return (
            <View style={styles.card}>
              {/* Container da Imagem com as Curvaturas do Site */}
              <View style={styles.imageContainer}>
                {item.imgUrl1 && item.imgUrl1.trim() !== "" ? (
                  <Image
                    source={{ uri: item.imgUrl1.trim() }}
                    style={styles.productImage}
                  />
                ) : (
                  <Image
                    source={require("../assets/logo.png")}
                    style={{ width: 180, height: 60, resizeMode: "contain" }}
                  />
                )}
              </View>

              {/* Corpo do Card Azul */}
              <View style={styles.cardBody}>
                <Text style={styles.productName}>
                  {item.productName || item.name}
                </Text>

                <Text style={styles.productCode}>
                  {item.codigo || item.code}
                </Text>

                <Text style={styles.productResume}>
                  {createExcerpt(
                    item.descricaoInstaleSoft || item.resume || "",
                    33,
                  )}
                </Text>

                {/* Especificações dos Vidros */}
                <View style={styles.specsContainer}>
                  {qtdConvencional > 0 && (
                    <Text style={styles.specText}>
                      {`${qtdConvencional} VIDRO(S) CONVENCIONAL(IS)`}
                    </Text>
                  )}

                  {qtdInteligente > 0 && (
                    <Text style={styles.specText}>
                      {`${qtdInteligente} VIDRO(S) INTELIGENTE(S)`}
                    </Text>
                  )}
                </View>

                {/* Botão Ver Mais Branco Estilo Clássico Soft */}
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.9}
                  onPress={() => {
                    router.push({
                      pathname: "/screens/productDetails" as any,
                      params: {
                        id: String(item.id),
                        modelId: model,
                        year: year,
                        categoryId: category,
                      },
                    });
                  }}
                >
                  <Text style={styles.actionButtonText}>VER MAIS</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            Nenhum produto cadastrado para os filtros selecionados.
          </Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF1F8", // Fundo azulado premium padrão
  },
  center: {
    flex: 1,
    backgroundColor: "#EBF1F8",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#484848",
    fontSize: 15,
    fontWeight: "600",
  },
  /* ESTILOS DO HEADER COM LOGO */
  header: {
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 180,
    height: 48,
  },
  /* SUB-HEADER VOLTAR SLIM */
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
  /* CARD DESIGN ORIGINAL PRESERVA SEU DECORADO */
  card: {
    backgroundColor: "#1C61AC",
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    marginBottom: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DFDFE7",
    shadowColor: "#1C61AC",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    backgroundColor: "#FFFFFF",
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderTopRightRadius: 38,
    borderBottomLeftRadius: 40,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  cardBody: {
    paddingTop: 30,
    paddingBottom: 35,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  productName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  productCode: {
    fontSize: 13,
    color: "#DFDFE7",
    fontWeight: "300",
    textTransform: "uppercase",
    marginBottom: 16,
    letterSpacing: 1.3,
  },
  productResume: {
    fontSize: 17,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
    letterSpacing: 1.2,
  },
  specsContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  specText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
    marginTop: 6,
    textAlign: "center",
  },
  actionButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    width: 140,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  actionButtonText: {
    color: "#484848",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 1.6,
  },
  emptyText: {
    textAlign: "center",
    color: "#A0A0AB",
    marginTop: 60,
    fontSize: 16,
  },
});
