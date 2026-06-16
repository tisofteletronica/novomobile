import { FilterButton } from "@/src/components/FilterButton";
import { SelectionModal } from "@/src/components/SelectionModal";
import { searchService } from "@/src/services/searchService";
import { useRouter } from "expo-router";
import { Search as SearchIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// IMPORTAÇÃO CORRETA QUE REMOVE O ALERTA AMARLO:
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchVehicle() {
  const router = useRouter();
  const [modalType, setModalType] = useState<"brand" | "model" | "year" | null>(
    null,
  );

  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<any>(null);

  useEffect(() => {
    searchService.getAutomakers().then(setManufacturers).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      searchService.getModelsById(selectedBrand.id).then(setModels);
      setSelectedModel(null);
      setSelectedYear(null);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedModel) {
      searchService.getYears(selectedModel.id).then(setYears);
      setSelectedYear(null);
    }
  }, [selectedModel]);

  function handleSearch() {
    if (selectedModel && selectedYear) {
      router.push({
        pathname: "/screens/categoryList" as any,
        params: {
          modelId: String(selectedModel.id),
          year: String(selectedYear.ano),
        },
      });
    }
  }

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* CABEÇALHO BRANCO INTEGRADO COM LOGO */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* CORPO DA TELA COM DESTAQUE COMPLEMENTAR */}
      <View style={styles.body}>
        {/* CARD DE BUSCA FLUTUANTE PREMIUM */}
        <View style={styles.card}>
          <Text style={styles.title}>
            Qual o produto ideal para o meu carro?
          </Text>

          <View style={styles.filtersWrapper}>
            <FilterButton
              label="Montadora"
              value={selectedBrand?.name}
              onPress={() => setModalType("brand")}
            />
            <FilterButton
              label="Modelo"
              value={selectedModel?.name}
              disabled={!selectedBrand}
              onPress={() => setModalType("model")}
            />
            <FilterButton
              label="Ano"
              value={selectedYear?.ano?.toString()}
              disabled={!selectedModel}
              onPress={() => setModalType("year")}
            />
          </View>

          {/* BOTÃO ESTILIZADO SOFT (CORTADO NA DIAGONAL) */}
          <TouchableOpacity
            disabled={!selectedYear}
            onPress={handleSearch}
            style={[
              styles.searchButton,
              !selectedYear && styles.searchButtonDisabled,
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.searchButtonText}>BUSCAR PRODUTO</Text>
            <SearchIcon size={18} color="#FFFFFF" strokeWidth={3} />
          </TouchableOpacity>
        </View>

        {/* RODAPÉ SUTIL DA MARCA */}
        <Text style={styles.footerText}>SOFT ELETRÔNICA © 2026</Text>
      </View>

      <SelectionModal
        visible={!!modalType}
        title={
          modalType === "brand"
            ? "Montadora"
            : modalType === "model"
              ? "Modelo"
              : "Ano"
        }
        data={
          modalType === "brand"
            ? manufacturers
            : modalType === "model"
              ? models
              : years
        }
        onClose={() => setModalType(null)}
        onSelect={(item: any) => {
          if (modalType === "brand") setSelectedBrand(item);
          if (modalType === "model") setSelectedModel(item);
          if (modalType === "year") setSelectedYear(item);
          setModalType(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F5",
  },
  logo: {
    width: 200,
    height: 55,
  },
  body: {
    flex: 1,
    backgroundColor: "#EBF1F8", // Tom azul/cinza suave para dar contraste
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 32, // Bordas mais suaves e modernas
    shadowColor: "#1C61AC", // Sombra usando o tom azul da marca
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#DFDFE7",
  },
  title: {
    fontSize: 20,
    color: "#252429",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 28,
  },
  filtersWrapper: {
    marginBottom: 12,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FC4C02", // Laranja Soft ativado
    height: 56,
    // Identidade visual com cantos alternados [16px_0] replicada no mobile:
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    marginTop: 12,
    shadowColor: "#FC4C02",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  searchButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
    marginRight: 8,
    letterSpacing: 1.5,
  },
  footerText: {
    textAlign: "center",
    color: "#A0A0AB",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 32,
    letterSpacing: 1.2,
  },
});
