import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { TendenciaController } from "../controllers/TendenciaController";

export default function TendenciasScreen() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [temas, setTemas] = useState([]);
  const [retos, setRetos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Estado para formulario de creación
  const [newItem, setNewItem] = useState({
    titulo: "",
    subtitulo: "",
    tipo: "tema",
    porcentaje: "0",
    miembros: "0",
  });

  // Estado para edición
  const [selectedItem, setSelectedItem] = useState(null);

  // CARGAR DATOS (READ)
  const cargarDatos = async () => {
    const allData = await TendenciaController.getAll();
    if (allData.success) {
      setEstudiantes(allData.data.filter((i) => i.tipo === "estudiante"));
      setTemas(allData.data.filter((i) => i.tipo === "tema"));
      setRetos(allData.data.filter((i) => i.tipo === "reto"));
    }
  };

  // Recargar datos cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  // CREAR (CREATE)
  const handleCreate = async () => {
    if (!newItem.titulo) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    // Asignar imagen o color por defecto según tipo para que no se vea vacío
    let imgSource = "";
    if (newItem.tipo === "estudiante") imgSource = "buddy.png"; // Default fallback
    if (newItem.tipo === "reto") imgSource = "#FFD166"; // Default color

    const result = await TendenciaController.create(
      newItem.titulo,
      newItem.subtitulo,
      newItem.tipo,
      parseInt(newItem.miembros) || 0,
      parseInt(newItem.porcentaje) || 0,
      imgSource
    );

    if (result.success) {
      setModalVisible(false);
      setNewItem({
        titulo: "",
        subtitulo: "",
        tipo: "tema",
        porcentaje: "0",
        miembros: "0",
      });
      cargarDatos();
    } else {
      Alert.alert("Error", "No se pudo crear el elemento");
    }
  };

  // ACTUALIZAR (UPDATE)
  const handleUpdate = async () => {
    if (!selectedItem.titulo) return;

    const result = await TendenciaController.update(
      selectedItem.id,
      selectedItem.titulo,
      parseInt(selectedItem.porcentaje) || 0
    );

    if (result.success) {
      setEditModalVisible(false);
      setSelectedItem(null);
      cargarDatos();
    } else {
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  // ELIMINAR (DELETE)
  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar",
      "¿Estás seguro de que quieres eliminar este elemento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await TendenciaController.delete(id);
            cargarDatos();
          },
        },
      ]
    );
  };

  // Preparar edición
  const openEditModal = (item) => {
    setSelectedItem({ ...item, porcentaje: item.porcentaje.toString() });
    setEditModalVisible(true);
  };

  // RENDERIZADO DE ITEMS
  const renderEstudiante = ({ item }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onLongPress={() => handleDelete(item.id)}
    >
      {/* Fallback simple para imágenes locales vs strings */}
      <Image
        source={
          typeof item.imgSource === "number"
            ? item.imgSource
            : require("../assets/iconos/buddy.png")
        }
        style={styles.studentImage}
      />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.titulo}</Text>
        <Text style={styles.studentSubtext}>{item.subtitulo}</Text>
      </View>
      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectButtonText}>Conectar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderTema = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.topicContainer}
      onPress={() => openEditModal(item)}
      onLongPress={() => handleDelete(item.id)}
    >
      <View style={styles.topicHeader}>
        <Text style={styles.topicTitle}>{item.titulo}</Text>
        <Text style={styles.topicPercent}>{item.porcentaje}%</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <LinearGradient
          colors={["#00FFD1", "#0099CC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBarFill, { width: `${item.porcentaje}%` }]}
        />
      </View>
    </TouchableOpacity>
  );

  const renderReto = ({ item }) => (
    <TouchableOpacity
      style={styles.challengeCard}
      onLongPress={() => handleDelete(item.id)}
    >
      <View
        style={[
          styles.challengeIconContainer,
          {
            backgroundColor: item.imgSource.startsWith("#")
              ? item.imgSource
              : "#96CEB4",
          },
        ]}
      >
        <Ionicons name="trophy" size={24} color="#fff" />
      </View>
      <Text style={styles.challengeTitle} numberOfLines={2}>
        {item.titulo}
      </Text>
      <View style={styles.challengeFooter}>
        <Text style={styles.challengeMembers}>{item.miembros} miembros</Text>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Unirme</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#00FFD1", "#0099CC"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Tendencias</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="add-circle-outline" size={32} color="#000" />
            </TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="#000" />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SECCIÓN 1: ESTUDIANTES POPULARES */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Estudiantes populares</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todo</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={estudiantes}
              renderItem={renderEstudiante}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay estudiantes aún.</Text>
              }
            />
          </View>

          {/* SECCIÓN 2: TEMAS MÁS BUSCADOS */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Temas más buscados</Text>
            <Text style={styles.hintText}>
              (Toca para editar, mantén para borrar)
            </Text>
            <View style={styles.topicsList}>
              {temas.length > 0 ? (
                temas.map(renderTema)
              ) : (
                <Text style={styles.emptyText}>Agrega un tema nuevo.</Text>
              )}
            </View>
          </View>

          {/* SECCIÓN 3: ÚNETE A UN RETO */}
          <View style={[styles.sectionContainer, { marginBottom: 20 }]}>
            <Text style={styles.sectionTitle}>Únete a un reto</Text>
            <FlatList
              data={retos}
              renderItem={renderReto}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay retos activos.</Text>
              }
            />
          </View>
        </ScrollView>

        {/* MODAL CREAR */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nuevo Elemento</Text>

              <Text style={styles.label}>Tipo:</Text>
              <View style={styles.typeSelector}>
                {["tema", "reto", "estudiante"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeBtn,
                      newItem.tipo === t && styles.typeBtnActive,
                    ]}
                    onPress={() => setNewItem({ ...newItem, tipo: t })}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        newItem.tipo === t && styles.typeTextActive,
                      ]}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                placeholder="Título / Nombre"
                style={styles.input}
                value={newItem.titulo}
                onChangeText={(text) =>
                  setNewItem({ ...newItem, titulo: text })
                }
              />

              {newItem.tipo === "estudiante" && (
                <TextInput
                  placeholder="Carrera / Subtítulo"
                  style={styles.input}
                  value={newItem.subtitulo}
                  onChangeText={(text) =>
                    setNewItem({ ...newItem, subtitulo: text })
                  }
                />
              )}

              {newItem.tipo === "tema" && (
                <TextInput
                  placeholder="Porcentaje (0-100)"
                  style={styles.input}
                  keyboardType="numeric"
                  value={newItem.porcentaje}
                  onChangeText={(text) =>
                    setNewItem({ ...newItem, porcentaje: text })
                  }
                />
              )}

              {newItem.tipo === "reto" && (
                <TextInput
                  placeholder="Miembros iniciales"
                  style={styles.input}
                  keyboardType="numeric"
                  value={newItem.miembros}
                  onChangeText={(text) =>
                    setNewItem({ ...newItem, miembros: text })
                  }
                />
              )}

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.btn, styles.btnCancel]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.btnConfirm]}
                  onPress={handleCreate}
                >
                  <Text style={{ color: "#fff" }}>Crear</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* MODAL EDITAR (Solo para Temas por simplicidad) */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={editModalVisible}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Tema</Text>

              <TextInput
                style={styles.input}
                value={selectedItem?.titulo}
                onChangeText={(text) =>
                  setSelectedItem({ ...selectedItem, titulo: text })
                }
              />

              <Text style={styles.label}>
                Porcentaje: {selectedItem?.porcentaje}%
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={selectedItem?.porcentaje}
                onChangeText={(text) =>
                  setSelectedItem({ ...selectedItem, porcentaje: text })
                }
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.btn, styles.btnCancel]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.btnConfirm]}
                  onPress={handleUpdate}
                >
                  <Text style={{ color: "#fff" }}>Guardar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  appTitle: { fontSize: 28, fontWeight: "bold", color: "#000" },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  sectionContainer: { marginTop: 20, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  hintText: {
    fontSize: 10,
    color: "#555",
    marginBottom: 10,
    fontStyle: "italic",
  },
  seeAllText: { color: "#005577", fontSize: 14, fontWeight: "600" },
  horizontalList: { paddingRight: 20 },

  // Card Estudiante
  studentCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    alignItems: "center",
    width: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  studentInfo: { alignItems: "center", marginBottom: 10 },
  studentName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  studentSubtext: { fontSize: 12, color: "#666", textAlign: "center" },
  connectButton: {
    backgroundColor: "#0099CC",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  connectButtonText: { color: "#fff", fontSize: 12, fontWeight: "bold" },

  // Temas
  topicsList: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topicContainer: { marginBottom: 15 },
  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  topicTitle: { fontSize: 14, fontWeight: "600", color: "#333" },
  topicPercent: { fontSize: 14, fontWeight: "bold", color: "#0099CC" },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },

  // Retos
  challengeCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "space-between",
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    height: 40,
  },
  challengeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  challengeMembers: { fontSize: 10, color: "#888" },
  joinButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  joinButtonText: { fontSize: 10, fontWeight: "bold", color: "#333" },
  emptyText: { color: "#666", fontStyle: "italic", marginVertical: 10 },

  // Modales
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "85%",
    shadowColor: "#000",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5, color: "#333" },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  typeBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  typeBtnActive: { backgroundColor: "#0099CC", borderColor: "#0099CC" },
  typeText: { fontSize: 12, color: "#333" },
  typeTextActive: { color: "#fff", fontWeight: "bold" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  btn: { padding: 12, borderRadius: 8, width: "45%", alignItems: "center" },
  btnCancel: { backgroundColor: "#eee" },
  btnConfirm: { backgroundColor: "#0099CC" },
});
