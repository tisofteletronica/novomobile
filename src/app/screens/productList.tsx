import { searchService } from "@/src/services/searchService"; // Ajuste o seu import do service
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
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

  // Função para limitar o texto do resumo igual ao 'createExcerpt(resume, 33)' do site
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
    <SafeAreaView style={styles.container}>
      {/* HEADER DE NAVEGAÇÃO INTERNA */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#484848" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>
          Soft Eletrônica {">"} Pesquisa {">"} Produtos
        </Text>
      </View>

      {/* LISTA DE PRODUTOS */}
      <FlatList
        data={products}
        keyExtractor={(item, index) => `${item.id || index}-${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          if (!item) return null;

          // Converte os valores para número para bater com a regra do site: (Number(vidro) > 0)
          const qtdConvencional = Number(item.vidroConvencional) || 0;
          const qtdInteligente = Number(item.vidroInteligente) || 0;

          return (
            <View style={styles.card}>
              {/* 1. CONTAINER DA IMAGEM BRANCO (CURVATURA TR E BL IGUAL AO SITE) */}
              <View style={styles.imageContainer}>
                {item.imgUrl1 && item.imgUrl1.trim() !== "" ? (
                  <Image
                    source={{ uri: item.imgUrl1.trim() }}
                    style={styles.productImage}
                  />
                ) : (
                  // Logo padrão caso não tenha foto do produto
                  <Image
                    source={require("../assets/logo.png")}
                    style={{ width: 180, height: 60, resizeMode: "contain" }}
                  />
                )}
              </View>

              {/* 2. CORPO DO CARD AZUL (INVERTIDO PREPARADO PARA MOBILE) */}
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

                {/* 3. REGRAS DOS VIDROS BASEADO NO SEU COMPONENTE NEXT.JS */}
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

                {/* 4. BOTÃO VER MAIS BRANCO COM CANTO CORTADO (Estilo rounded-[10px_0] do site) */}
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
    padding: 20,
  },
  card: {
    backgroundColor: "#1C61AC", // Cor azul oficial do site
    borderTopRightRadius: 40, // rounded-tr-[40px]
    borderBottomLeftRadius: 40, // rounded-bl-[40px]
    marginBottom: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DFDFE7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  imageContainer: {
    backgroundColor: "#FFFFFF",
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderTopRightRadius: 38, // Acompanha o corte do card principal
    borderBottomLeftRadius: 40, // Faz a curva linda separando a imagem do bloco azul
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
    // Estilo clássico Soft do Next rounded-[10px_0] replicado no mobile:
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  actionButtonText: {
    color: "#484848",
    fontWeight: "500",
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
