import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AjustesScreen() {
  const [nombre, setNombre] = useState("");
  const [carrera, setCarrera] = useState("");
  const [cuatri, setCuatri] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Mi Perfil</Text>
        <Ionicons name="notifications-outline" size={26} color="#000" />
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/616/616408.png" }} // puedes reemplazar con tu imagen
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.addIcon}>
          <Ionicons name="add-circle" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Carrera"
          value={carrera}
          onChangeText={setCarrera}
        />
        <TextInput
          style={styles.input}
          placeholder="Cuatrimestre"
          value={cuatri}
          onChangeText={setCuatri}
        />
      </View>

      {/* Barra inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="flame-outline" size={24} color="#000" />
          <Text style={styles.navText}>Tendencias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
          <Text style={styles.navText}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#000" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#000" />
          <Text style={styles.navText}>Matching</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings" size={24} color="#00aaff" />
          <Text style={[styles.navText, { color: "#00aaff" }]}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00c3ff",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 10,
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  imageContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#fff",
  },
  addIcon: {
    position: "absolute",
    bottom: 0,
    right: 105,
  },
  inputsContainer: {
    marginTop: 40,
    width: "85%",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    height: 65,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
  },
});
