import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Download } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// IMPORTAÇÃO CORRETA DA ÁREA SEGURA PARA DESTRUIR OS AVISOS DO CONSOLE
import { SafeAreaView } from "react-native-safe-area-context";

// Importação das suas interfaces e serviços reais
import {
  getProductsByModelAndCategory,
  ProductsByModelAndCategoryResponse,
} from "@/src/services/searchService/products";

export default function ProductDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [product, setProduct] = useState<
    ProductsByModelAndCategoryResponse["content"][number] | null
  >(null);
  const [relatedProducts, setRelatedProducts] = useState<
    ProductsByModelAndCategoryResponse["content"]
  >([]);
  const [loading, setLoading] = useState(true);

  const id = String(params.id);
  const model = String(params.modelId);
  const year = String(params.year);
  const category = String(params.categoryId);

  useEffect(() => {
    if (model && year && category && id) {
      setLoading(true);

      getProductsByModelAndCategory(model, year, category, 0, 1000)
        .then((data) => {
          const list = data?.content || [];

          const currentProduct = list.find((p) => Number(p.id) === Number(id));
          setProduct(currentProduct || null);

          const related = list.filter((p) => Number(p.id) !== Number(id));
          setRelatedProducts(related.slice(0, 3));
        })
        .catch((err) =>
          console.error("Erro na busca de detalhes via TypeScript:", err),
        )
        .finally(() => setLoading(false));
    }
  }, [id, model, year, category]);

  function handleDownload(url: string) {
    if (url && url.trim() !== "") {
      Linking.openURL(url.trim()).catch((err) =>
        console.error("Erro ao abrir link de download:", err),
      );
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FC4C02" />
        <Text style={styles.loadingText}>Carregando informações...</Text>
      </View>
    );
  }

  if (!product) return null;

  const qtdConvencional = Number(product.vidroConvencional) || 0;
  const qtdInteligente = Number(product.vidroInteligente) || 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 1. HEADER PADRONIZADO DA SOFT ELETRÔNICA */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* 2. SUB-HEADER CLEAN COM BOTÃO VOLTAR EM CÁPSULA */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => {
            // Força o retorno correto para a tela de categorias mantendo os dados do veículo
            router.push({
              pathname: "/screens/categoryList" as any,
              params: {
                modelId: model,
                year: year,
              },
            });
          }}
          style={styles.backButton}
          activeOpacity={0.6}
        >
          <ChevronLeft size={20} color="#FC4C02" strokeWidth={3} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TÍTULO PRINCIPAL DO PRODUTO */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>{product.productName}</Text>
          <Text style={styles.mainSubtitle}>{product.codigo}</Text>
          <View style={styles.orangeLine} />
        </View>

        {/* CARD PRINCIPAL DE CONTEÚDO */}
        <View style={styles.mainArticleCard}>
          {/* CONTAINER DA IMAGEM BRANCO */}
          <View style={styles.productImageWrapper}>
            {product.imgUrl1 ? (
              <Image
                source={{ uri: product.imgUrl1.trim() }}
                style={styles.mainProductImage}
              />
            ) : (
              <Image
                source={require("../assets/logo.png")}
                style={{ width: 180, height: 60, resizeMode: "contain" }}
              />
            )}
          </View>

          {/* SEÇÃO GARANTIA DE 2 ANOS */}
          <View style={styles.garanteeBlock}>
            <View style={styles.garanteeBadge}>
              <Text style={styles.garanteeCheck}>✓</Text>
            </View>
            <View style={styles.garanteeTexts}>
              <Text style={styles.garanteeTitle}>GARANTIA DE 2 ANOS</Text>
              <Text style={styles.garanteeDescription}>
                Recomendamos que a instalação seja feita por profissional
                especializado e não nos responsabilizamos pelo mau uso do
                produto.
              </Text>
            </View>
          </View>

          {/* QUANTIDADE DE VIDROS COMPATÍVEIS */}
          <View style={styles.measuresBlock}>
            {qtdConvencional > 0 && (
              <Text style={styles.measureItem}>
                • {qtdConvencional} Vidro(s) Convencional(is)
              </Text>
            )}
            {qtdInteligente > 0 && (
              <Text style={styles.measureItem}>
                • {qtdInteligente} Vidro(s) Inteligente(s)
              </Text>
            )}
          </View>

          {/* FICHA TÉCNICA (CONTAINER CINZA ESPECÍFICO) */}
          <View style={styles.techSpecsCard}>
            <Text style={styles.specsHeaderTitle}>FICHA TÉCNICA:</Text>
            <Text style={styles.specsBodyText}>
              {product.descricaoInstaleSoft
                ? product.descricaoInstaleSoft.replace(/<br\s*\/?>/gi, "\n")
                : ""}
            </Text>

            {/* OBSERVAÇÃO / IMPORTANTE */}
            {product.observacao && product.observacao.trim() !== "" && (
              <View style={{ marginTop: 24 }}>
                <Text style={styles.specsHeaderTitle}>IMPORTANTE:</Text>
                <Text style={styles.specsBodyText}>
                  {product.observacao.replace(/<br\s*\/?>/gi, "\n")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* BOTÕES DE DOWNLOADS DOS MANUAIS ESTILO CORTADO SOFT */}
        <View style={styles.downloadButtonsWrapper}>
          {product.urlManual && product.urlManual.trim() !== "" && (
            <TouchableOpacity
              style={styles.downloadButton}
              activeOpacity={0.8}
              onPress={() => handleDownload(product.urlManual)}
            >
              <Text style={styles.downloadButtonText}>BAIXAR MANUAL</Text>
              <Download size={16} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          )}

          {product.urlEsquema && product.urlEsquema.trim() !== "" && (
            <TouchableOpacity
              style={styles.downloadButton}
              activeOpacity={0.8}
              onPress={() => handleDownload(product.urlEsquema)}
            >
              <Text style={styles.downloadButtonText}>BAIXAR ESQUEMA</Text>
              <Download size={16} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>

        {/* SEÇÃO CONHEÇA TAMBÉM */}
        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>CONHEÇA TAMBÉM</Text>
            <View style={styles.relatedOrangeLine} />

            {relatedProducts.map((item, index) => (
              <View key={item.id || index} style={styles.relatedCard}>
                <View style={styles.relatedImgContainer}>
                  <Image
                    source={{ uri: item.imgUrl1 }}
                    style={styles.relatedProductImage}
                  />
                </View>
                <View style={styles.relatedCardBody}>
                  <Text style={styles.relatedItemName}>{item.productName}</Text>
                  <Text style={styles.relatedItemCode}>{item.codigo}</Text>
                  <Text style={styles.relatedItemResume} numberOfLines={2}>
                    {item.descricaoInstaleSoft}
                  </Text>

                  <TouchableOpacity
                    style={styles.relatedButton}
                    activeOpacity={0.8}
                    onPress={() => {
                      router.setParams({ id: String(item.id) });
                    }}
                  >
                    <Text style={styles.relatedButtonText}>VER DETALHES</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF1F8", // Tom de fundo padrão unificado
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
  /* SUB-HEADER VOLTAR SLIM CAPSULA */
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
  scrollContent: {
    paddingBottom: 40,
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#252429",
  },
  mainSubtitle: {
    fontSize: 13,
    color: "#74747A",
    letterSpacing: 1.4,
    marginTop: 4,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  orangeLine: {
    width: 50,
    height: 4,
    backgroundColor: "#FC4C02", // Laranja Soft trazendo energia pra tela
    marginTop: 12,
  },
  mainArticleCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#DFDFE7",
    overflow: "hidden",
    paddingBottom: 24,
    shadowColor: "#1C61AC",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  productImageWrapper: {
    height: 260,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  mainProductImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  garanteeBlock: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: "flex-start",
  },
  garanteeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1C61AC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  garanteeCheck: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  garanteeTexts: {
    flex: 1,
  },
  garanteeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1C61AC",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  garanteeDescription: {
    fontSize: 13,
    color: "#74747A",
    lineHeight: 18,
  },
  measuresBlock: {
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  measureItem: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1C61AC",
    marginTop: 4,
  },
  techSpecsCard: {
    backgroundColor: "#F4F7FB",
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EBF1F8",
  },
  specsHeaderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#252429",
    letterSpacing: 1,
    marginBottom: 8,
  },
  specsBodyText: {
    fontSize: 14,
    color: "#484848",
    lineHeight: 20,
    textAlign: "justify",
  },
  downloadButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  downloadButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1C61AC",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    shadowColor: "#1C61AC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  downloadButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 0.8,
    marginRight: 6,
  },
  relatedSection: {
    marginTop: 44,
    paddingHorizontal: 20,
  },
  relatedTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#252429",
  },
  relatedOrangeLine: {
    width: 40,
    height: 4,
    backgroundColor: "#FC4C02",
    marginTop: 10,
    marginBottom: 24,
  },
  relatedCard: {
    backgroundColor: "#1C61AC",
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DFDFE7",
  },
  relatedImgContainer: {
    backgroundColor: "#FFFFFF",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
  },
  relatedProductImage: {
    width: "75%",
    height: "75%",
    resizeMode: "contain",
  },
  relatedCardBody: {
    padding: 20,
    alignItems: "center",
  },
  relatedItemName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  relatedItemCode: {
    fontSize: 12,
    color: "#E6F4FE",
    fontWeight: "300",
    marginTop: 2,
    marginBottom: 10,
    letterSpacing: 1,
  },
  relatedItemResume: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
    opacity: 0.9,
  },
  relatedButton: {
    backgroundColor: "#FFFFFF",
    height: 38,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  relatedButtonText: {
    color: "#1C61AC",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
