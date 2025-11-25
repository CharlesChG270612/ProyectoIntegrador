import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function InicioScreen() {
  const conexiones = [
    { id: "1", nombre: "Carlos", materia: "Cálculo", porcentaje: 95, img: require("../assets/iconos/carlos.png") },
    { id: "2", nombre: "María", materia: "Biología", porcentaje: 82, img: require("../assets/iconos/maria.png") },
    { id: "3", nombre: "Pedro", materia: "Física", porcentaje: 97, img: require("../assets/iconos/pedro.png") },
  ];

  const preferencias = [
    { id: "1", titulo: "Cálculo", valor: 93 },
    { id: "2", titulo: "Física", valor: 85 },
    { id: "3", titulo: "Biología", valor: 72 },
    { id: "4", titulo: "Desarrollo Humano", valor: 52 },
  ];

  return (
    <LinearGradient colors={["#00FFD1", "#0099CC"]} style={styles.gradient}>
      <View style={styles.container}>

        <Text style={styles.title}>StudyBuddy</Text>
        <Text style={styles.subtitle}>Matching</Text>

        {/* CARD */}
        <View style={styles.card}>
          <Image
            source={require("../assets/iconos/buddy.png")}
            style={styles.buddyImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardName}>Luisa</Text>
            <Text style={styles.cardPercent}>93%</Text>
          </View>

          <Text style={styles.cardDescription}>
            Interesada en estudiar cálculo diferencial al igual que cálculo multivariable.
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.actions}>
          <Ionicons name="close-circle" size={55} color="#fff" />
          <Ionicons name="heart-circle" size={60} color="#0ff" />
          <Ionicons name="chatbubble-ellipses" size={55} color="#fff" />
        </View>

        <Text style={styles.sectionTitle}>Conexiones</Text>

        <FlatList
          data={conexiones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.connectionItem}>
              <Image source={item.img} style={styles.connectionImg} />
              <View>
                <Text style={styles.connectionName}>{item.nombre}</Text>
                <Text style={styles.connectionMateria}>{item.materia}</Text>
              </View>
              <Text style={styles.connectionPercent}>{item.porcentaje}%</Text>
            </View>
          )}
        />

        <Text style={styles.sectionTitle}>Preferencias</Text>

        {preferencias.map((p) => (
          <View key={p.id} style={styles.prefContainer}>
            <Text style={styles.prefLabel}>{p.titulo}</Text>
            <View style={styles.prefBar}>
              <View style={[styles.prefFill, { width: `${p.valor}%` }]} />
            </View>
            <Text style={styles.prefValue}>{p.valor}%</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, paddingTop: 50 },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    marginBottom: 25,
  },
  buddyImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  cardName: { fontSize: 22, fontWeight: "bold" },
  cardPercent: { fontSize: 22, fontWeight: "bold", color: "#0099CC" },
  cardDescription: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    color: "#444",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#000",
  },

  connectionItem: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  connectionImg: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  connectionName: { fontWeight: "600", fontSize: 16 },
  connectionMateria: { fontSize: 12, color: "#666" },
  connectionPercent: {
    marginLeft: "auto",
    fontWeight: "bold",
    fontSize: 16,
    color: "#0099CC",
  },

  prefContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  prefLabel: { fontWeight: "600", marginBottom: 4 },
  prefBar: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  prefFill: {
    backgroundColor: "#00C4CC",
    height: "100%",
    borderRadius: 8,
  },
  prefValue: {
    marginTop: 4,
    fontSize: 12,
    color: "#444",
  },
});
