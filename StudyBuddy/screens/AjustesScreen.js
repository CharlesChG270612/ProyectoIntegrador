import React, { useState, useEffect } from "react";
import {View,Text,TextInput,Image,TouchableOpacity,StyleSheet,SafeAreaView,Alert} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AjustesScreen() {
  const [nombre, setNombre] = useState("");
  const [carrera, setCarrera] = useState("");
  const [cuatri, setCuatri] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const nombreGuardado = await AsyncStorage.getItem("nombreUsuario");
        const carreraGuardada = await AsyncStorage.getItem("carreraUsuario");
        const cuatriGuardado = await AsyncStorage.getItem("cuatriUsuario");

        if (nombreGuardado) setNombre(nombreGuardado);
        if (carreraGuardada) setCarrera(carreraGuardada);
        if (cuatriGuardado) setCuatri(cuatriGuardado);
      } catch (error) {
        console.log("Error cargando datos:", error);
      }
    };
    obtenerDatos();
  }, []);

  const guardarCambios = async () => {
    try {
      await AsyncStorage.setItem("carreraUsuario", carrera);
      await AsyncStorage.setItem("cuatriUsuario", cuatri);
      Alert.alert("Cambios guardados", "Tu información se ha actualizado correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
      console.log("Error guardando:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Mi Perfil</Text>
        <Ionicons name="notifications-outline" size={26} color="#000" />
      </View>

      <View style={styles.imageContainer}>
        <Image source={require("../assets/iconos/carlos.png")} style={styles.avatar} />
        <TouchableOpacity style={styles.addIcon}>
          <Ionicons name="add-circle" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputsContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: "#ddd" }]}
          placeholder="Nombre completo"
          value={nombre}
          editable={false}
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

        <TouchableOpacity style={styles.saveButton} onPress={guardarCambios}>
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
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
  saveButton: {
    backgroundColor: "#00a8cc",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});