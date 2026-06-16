import { Search as SearchIcon, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function SelectionModal({
  visible,
  title,
  data,
  onSelect,
  onClose,
}: any) {
  const [searchText, setSearchText] = useState("");

  // Filtro de busca corrigido
  const filteredData =
    data?.filter((item: any) => {
      // Prioriza buscar pelo ano, se não tiver, busca pelo nome
      const label = (
        item.ano ? String(item.ano) : item.name || ""
      ).toLowerCase();
      return label.includes(searchText.toLowerCase());
    }) || [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#484848" />
            </TouchableOpacity>
          </View>

          {/* Barra de Pesquisa */}
          <View style={styles.searchContainer}>
            <SearchIcon size={20} color="#484848" />
            <TextInput
              placeholder="Pesquisar..."
              placeholderTextColor="#A0A0AB"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Lista de Itens */}
          <FlatList
            data={filteredData}
            // A junção do ID com o Index resolve o erro "two children with the same key"
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => {
              // CORREÇÃO VISUAL: Se a API mandar o "ano", mostra o ano. Se não, mostra o nome.
              const displayText = item.ano ? String(item.ano) : item.name;

              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                    setSearchText("");
                  }}
                  style={styles.listItem}
                >
                  <Text style={styles.listText}>{displayText}</Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// Estilos Nativos Limpos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#484848",
  },
  closeButton: {
    backgroundColor: "#F5F5F7",
    padding: 8,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F6FB",
    borderWidth: 1,
    borderColor: "#DFDFE7",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    marginLeft: 12,
    fontSize: 16,
    color: "#484848",
  },
  listItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  listText: {
    fontSize: 18,
    color: "#484848",
  },
  emptyText: {
    textAlign: "center",
    color: "#A0A0AB",
    marginTop: 40,
    fontSize: 16,
  },
});
