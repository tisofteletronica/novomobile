import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Download } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// 1. IMPORTA A SUA FUNÇÃO E INTERFACE REAIS DO SEU ARQUIVO DE SERVIÇO
import {
    getProductsByModelAndCategory,
    ProductsByModelAndCategoryResponse,
} from "@/src/services/searchService/products"; // Ajuste o caminho conforme necessário

export default function ProductDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Tipagem correta usando o array extraído do seu content
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

  // 2. O FILTRO SEGUINDO EXATAMENTE A REGRA DO SEU TYPESCRIPT E NEXT.JS
  useEffect(() => {
    if (model && year && category && id) {
      setLoading(true);

      // Bate no seu endpoint real com paginação padrão ampla para trazer o escopo completo
      getProductsByModelAndCategory(model, year, category, 0, 1000)
        .then((data) => {
          const list = data?.content || [];

          // Encontra o produto ativo clicado na tela anterior
          const currentProduct = list.find((p) => Number(p.id) === Number(id));
          setProduct(currentProduct || null);

          // Filtra os itens relacionados tirando o atual (Regra do seu GetToKnow)
          const related = list.filter((p) => Number(p.id) !== Number(id));
          setRelatedProducts(related.slice(0, 3)); // Garante até 3 itens na base
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
    <SafeAreaView style={styles.container}>
      {/* HEADER DE NAVEGAÇÃO FIXO */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#484848" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          Soft Eletrônica {">"} {product.productName}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TITULO PRINCIPAL */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>{product.productName}</Text>
          <Text style={styles.mainSubtitle}>{product.codigo}</Text>
          <View style={styles.blueLine} />
        </View>

        {/* CARD PRINCIPAL DE CONTEÚDO */}
        <View style={styles.mainArticleCard}>
          {/* CONTAINER DA IMAGEM */}
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

          {/* SESSÃO GARANTIA DE 2 ANOS */}
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

          {/* FICHA TÉCNICA (CONTAINER CINZA CLARO) */}
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

        {/* BOTÕES DE DOWNLOADS DOS MANUAIS */}
        <View style={styles.downloadButtonsWrapper}>
          {product.urlManual && product.urlManual.trim() !== "" && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload(product.urlManual)}
            >
              <Text style={styles.downloadButtonText}>BAIXAR MANUAL</Text>
              <Download size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {product.urlEsquema && product.urlEsquema.trim() !== "" && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload(product.urlEsquema)}
            >
              <Text style={styles.downloadButtonText}>BAIXAR ESQUEMA</Text>
              <Download size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* SEÇÃO CONHEÇA TAMBÉM */}
        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>CONHEÇA TAMBÉM</Text>
            <View style={styles.relatedBlueLine} />

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
                    onPress={() => {
                      // Recarrega dinamicamente o hook alterando o param ID
                      router.setParams({ id: String(item.id) });
                    }}
                  >
                    <Text style={styles.relatedButtonText}>VER MAIS</Text>
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

// OS ESTILOS NATIVOS PERMANECEM ACURADOS ABAIXO...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F7" },
  center: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 12, color: "#484848", fontSize: 16 },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DFDFE7",
  },
  backButton: { marginRight: 12 },
  navTitle: { fontSize: 14, color: "#484848", fontWeight: "500", flex: 1 },
  scrollContent: { paddingBottom: 60 },
  titleContainer: { paddingHorizontal: 24, marginTop: 24, marginBottom: 20 },
  mainTitle: { fontSize: 32, fontWeight: "bold", color: "#252429" },
  mainSubtitle: {
    fontSize: 14,
    color: "#484848",
    letterSpacing: 1.4,
    marginTop: 4,
    textTransform: "uppercase",
  },
  blueLine: { width: 60, height: 4, backgroundColor: "#1C61AC", marginTop: 12 },
  mainArticleCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#F7F6FB",
    overflow: "hidden",
    paddingBottom: 24,
  },
  productImageWrapper: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  mainProductImage: { width: "100%", height: "100%", resizeMode: "contain" },
  garanteeBlock: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 24,
    alignItems: "flex-start",
  },
  garanteeBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1C61AC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  garanteeCheck: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold" },
  garanteeTexts: { flex: 1 },
  garanteeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C61AC",
    letterSpacing: 1,
    marginBottom: 4,
  },
  garanteeDescription: { fontSize: 14, color: "#484848", lineHeight: 18 },
  measuresBlock: {
    alignItems: "center",
    marginVertical: 24,
    paddingHorizontal: 20,
  },
  measureItem: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C61AC",
    marginTop: 6,
  },
  techSpecsCard: {
    backgroundColor: "#F7F6FB",
    padding: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  specsHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#484848",
    letterSpacing: 1.5,
    marginBottom: 10,
    textAlign: "center",
  },
  specsBodyText: {
    fontSize: 15,
    color: "#484848",
    lineHeight: 22,
    textAlign: "justify",
    letterSpacing: 0.5,
  },
  downloadButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  downloadButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1C61AC",
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  downloadButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
    marginRight: 8,
  },
  relatedSection: { marginTop: 48, paddingHorizontal: 16 },
  relatedTitle: { fontSize: 24, fontWeight: "bold", color: "#252429" },
  relatedBlueLine: {
    width: 50,
    height: 4,
    backgroundColor: "#1C61AC",
    marginTop: 10,
    marginBottom: 24,
  },
  relatedCard: {
    backgroundColor: "#1C61AC",
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    marginBottom: 24,
    overflow: "hidden",
  },
  relatedImgContainer: {
    backgroundColor: "#FFFFFF",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  relatedProductImage: { width: "80%", height: "80%", resizeMode: "contain" },
  relatedCardBody: { padding: 20, alignItems: "center" },
  relatedItemName: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF" },
  relatedItemCode: {
    fontSize: 12,
    color: "#DFDFE7",
    marginTop: 2,
    marginBottom: 8,
  },
  relatedItemResume: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },
  relatedButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  relatedButtonText: { color: "#1C61AC", fontWeight: "bold", fontSize: 13 },
});
