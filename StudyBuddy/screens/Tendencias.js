import React, { useState, useCallback } from "react";
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
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { TendenciaController } from "../controllers/TendenciaController";

// 1. SOLUCIÓN IMÁGENES: Mapeamos el string de la BD al recurso real
const ASSET_MAP = {
  "carlos.png": require("../assets/iconos/carlos.png"),
  "maria.png": require("../assets/iconos/maria.png"),
  "pedro.png": require("../assets/iconos/pedro.png"),
  "buddy.png": require("../assets/iconos/buddy.png"),
};

export default function TendenciasScreen() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [temas, setTemas] = useState([]);
  const [retos, setRetos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Estados para formularios
  const [newItem, setNewItem] = useState({
    titulo: "",
    subtitulo: "",
    tipo: "tema",
    porcentaje: "",
    miembros: "",
  });
  const [selectedItem, setSelectedItem] = useState(null);

  // --- CARGAR DATOS ---
  const cargarDatos = async () => {
    try {
      const allData = await TendenciaController.getAll();
      if (allData.success) {
        setEstudiantes(allData.data.filter((i) => i.tipo === "estudiante"));
        setTemas(allData.data.filter((i) => i.tipo === "tema"));
        setRetos(allData.data.filter((i) => i.tipo === "reto"));
      }
    } catch (error) {
      console.error("Error cargando tendencias:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  // --- CREAR ---
  const handleCreate = async () => {
    if (!newItem.titulo.trim()) {
      Alert.alert("Atención", "El título es obligatorio");
      return;
    }

    let imgSource = "";
    if (newItem.tipo === "estudiante") imgSource = "buddy.png";
    if (newItem.tipo === "reto") imgSource = "#FFD166"; // Color hexadecimal

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
        porcentaje: "",
        miembros: "",
      });
      cargarDatos();
    } else {
      Alert.alert("Error", "No se pudo crear.");
    }
  };

  // --- ACTUALIZAR ---
  const handleUpdate = async () => {
    if (!selectedItem?.titulo) return;
    const result = await TendenciaController.update(
      selectedItem.id,
      selectedItem.titulo,
      parseInt(selectedItem.porcentaje) || 0
    );
    if (result.success) {
      setEditModalVisible(false);
      setSelectedItem(null);
      cargarDatos();
    }
  };

  // --- ELIMINAR ---
  const handleDelete = (id) => {
    Alert.alert("Eliminar", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await TendenciaController.delete(id);
          cargarDatos();
        },
      },
    ]);
  };

  // Helper para imágenes
  const getImageSource = (imgString) =>
    ASSET_MAP[imgString] || ASSET_MAP["buddy.png"];

  // --- RENDERS ---
  const renderEstudiante = ({ item }) => (
    <TouchableOpacity
      style={styles.cardEstudiante}
      onLongPress={() => handleDelete(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.imgContainer}>
        <Image
          source={getImageSource(item.imgSource)}
          style={styles.studentImage}
        />
        <View style={styles.onlineBadge} />
      </View>
      <Text style={styles.studentName} numberOfLines={1}>
        {item.titulo}
      </Text>
      <Text style={styles.studentCareer} numberOfLines={1}>
        {item.subtitulo}
      </Text>
      <TouchableOpacity style={styles.btnConnect}>
        <Text style={styles.btnConnectText}>Conectar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderTema = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.cardTema}
      onPress={() => {
        setSelectedItem({ ...item, porcentaje: item.porcentaje.toString() });
        setEditModalVisible(true);
      }}
      onLongPress={() => handleDelete(item.id)}
    >
      <View style={styles.temaIcon}>
        <Ionicons name="book" size={20} color="#0099CC" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <Text style={styles.temaTitle}>{item.titulo}</Text>
          <Text style={styles.temaPercent}>{item.porcentaje}%</Text>
        </View>
        <View style={styles.progressBg}>
          <LinearGradient
            colors={["#00FFD1", "#0099CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressFill,
              { width: `${Math.min(item.porcentaje, 100)}%` },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReto = ({ item }) => {
    const bg = item.imgSource?.startsWith("#") ? item.imgSource : "#FF6B6B";
    return (
      <TouchableOpacity
        style={[styles.cardReto, { backgroundColor: bg }]}
        onLongPress={() => handleDelete(item.id)}
      >
        <View style={styles.retoTop}>
          <Ionicons name="trophy" size={20} color="rgba(255,255,255,0.8)" />
          <Text style={styles.retoMembers}>{item.miembros} 🔥</Text>
        </View>
        <Text style={styles.retoTitle} numberOfLines={2}>
          {item.titulo}
        </Text>
        <TouchableOpacity style={styles.btnJoin}>
          <Text style={[styles.btnJoinText, { color: bg }]}>Unirme</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F6F9" }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#00FFD1", "#0099CC"]}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerSubtitle}>Descubre</Text>
              <Text style={styles.headerTitle}>Tendencias</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="add" size={28} color="#0099CC" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Estudiantes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Compañeros populares</Text>
            <Text style={styles.link}>Ver todos</Text>
          </View>
          <FlatList
            data={estudiantes}
            renderItem={renderEstudiante}
            keyExtractor={(i) => i.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            ListEmptyComponent={
              <Text style={styles.empty}>Sin estudiantes.</Text>
            }
          />
        </View>

        {/* Temas */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { marginLeft: 20, marginBottom: 15 }]}
          >
            Tendencias de estudio
          </Text>
          <View style={{ paddingHorizontal: 20 }}>
            {temas.length > 0 ? (
              temas.map(renderTema)
            ) : (
              <Text style={styles.empty}>Sin temas.</Text>
            )}
          </View>
        </View>

        {/* Retos */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { marginLeft: 20, marginBottom: 15 }]}
          >
            Retos activos
          </Text>
          <FlatList
            data={retos}
            renderItem={renderReto}
            keyExtractor={(i) => i.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            ListEmptyComponent={<Text style={styles.empty}>Sin retos.</Text>}
          />
        </View>
      </ScrollView>

      {/* MODAL CREAR */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Crear Nuevo</Text>
            <View style={styles.typeRow}>
              {["tema", "reto", "estudiante"].map((t) => (
                <Pressable
                  key={t}
                  style={[
                    styles.typePill,
                    newItem.tipo === t && styles.typePillActive,
                  ]}
                  onPress={() => setNewItem({ ...newItem, tipo: t })}
                >
                  <Text
                    style={[
                      styles.typeText,
                      newItem.tipo === t && styles.typeTextActive,
                    ]}
                  >
                    {t.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={newItem.titulo}
              onChangeText={(t) => setNewItem({ ...newItem, titulo: t })}
            />
            {newItem.tipo === "estudiante" && (
              <TextInput
                style={styles.input}
                placeholder="Carrera"
                value={newItem.subtitulo}
                onChangeText={(t) => setNewItem({ ...newItem, subtitulo: t })}
              />
            )}
            {newItem.tipo === "tema" && (
              <TextInput
                style={styles.input}
                placeholder="Porcentaje (0-100)"
                keyboardType="numeric"
                value={newItem.porcentaje}
                onChangeText={(t) => setNewItem({ ...newItem, porcentaje: t })}
              />
            )}
            {newItem.tipo === "reto" && (
              <TextInput
                style={styles.input}
                placeholder="Miembros"
                keyboardType="numeric"
                value={newItem.miembros}
                onChangeText={(t) => setNewItem({ ...newItem, miembros: t })}
              />
            )}

            <TouchableOpacity style={styles.btnPrimary} onPress={handleCreate}>
              <Text style={styles.btnPrimaryText}>Crear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Tema</Text>
            <TextInput
              style={styles.input}
              value={selectedItem?.titulo}
              onChangeText={(t) =>
                setSelectedItem({ ...selectedItem, titulo: t })
              }
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={selectedItem?.porcentaje}
              onChangeText={(t) =>
                setSelectedItem({ ...selectedItem, porcentaje: t })
              }
            />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleUpdate}>
              <Text style={styles.btnPrimaryText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnClose}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.btnCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: Platform.OS === "android" ? 40 : 0,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 1,
  },
  headerTitle: { color: "#fff", fontSize: 32, fontWeight: "800" },
  iconBtn: { backgroundColor: "#fff", padding: 8, borderRadius: 12 },
  section: { marginTop: 25 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  link: { color: "#0099CC", fontWeight: "600" },
  empty: { color: "#999", fontStyle: "italic", marginLeft: 20 },

  // Cards
  cardEstudiante: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    width: 140,
    marginRight: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imgContainer: { marginBottom: 10 },
  studentImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#f0f0f0",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CD964",
    borderWidth: 2,
    borderColor: "#fff",
  },
  studentName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
  },
  studentCareer: { color: "#888", fontSize: 11, marginBottom: 12 },
  btnConnect: {
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  btnConnectText: { color: "#0099CC", fontWeight: "700", fontSize: 11 },

  cardTema: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    elevation: 2,
  },
  temaIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  temaTitle: { fontWeight: "600", fontSize: 15, color: "#333" },
  temaPercent: { fontWeight: "700", color: "#0099CC", fontSize: 14 },
  progressBg: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    width: "100%",
  },
  progressFill: { height: "100%", borderRadius: 3 },

  cardReto: {
    width: 160,
    height: 170,
    borderRadius: 24,
    padding: 16,
    marginRight: 15,
    justifyContent: "space-between",
  },
  retoTop: { flexDirection: "row", justifyContent: "space-between" },
  retoMembers: { color: "#fff", fontWeight: "700", fontSize: 12 },
  retoTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  btnJoin: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  btnJoinText: { fontWeight: "700", fontSize: 12 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 24,
    padding: 25,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  typeRow: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    padding: 4,
    borderRadius: 12,
  },
  typePill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  typePillActive: { backgroundColor: "#fff", elevation: 2 },
  typeText: { fontSize: 11, fontWeight: "600", color: "#999" },
  typeTextActive: { color: "#0099CC" },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    fontSize: 16,
  },
  btnPrimary: {
    backgroundColor: "#0099CC",
    borderRadius: 14,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  btnPrimaryText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnClose: { marginTop: 15, alignItems: "center" },
  btnCloseText: { color: "#666", fontWeight: "600" },
});
