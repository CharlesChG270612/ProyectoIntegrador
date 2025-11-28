import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, SafeAreaView,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Interfaz_Inicio() {
  const [pressedCard, setPressedCard] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#00f7b2", "#04e4d9", "#0fb8c4"]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.container}>

          <Text style={styles.title}>Inicio</Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={22} color="#555" />
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="#666"
              style={styles.searchInput}
            />
          </View>

          <Text style={styles.sectionTitle}>Materias del día</Text>

          <TouchableOpacity
            style={styles.card}
            onPressIn={() => setPressedCard(1)}
            onPressOut={() => setPressedCard(null)}
          >
            <Image
              source={require("../assets/iconos/carlos.png")}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>Cálculo diferencial</Text>
          </TouchableOpacity>

          {pressedCard === 1 && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>
                Estudia límites, derivadas y el cambio de una función respecto al tiempo.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.card}
            onPressIn={() => setPressedCard(2)}
            onPressOut={() => setPressedCard(null)}
          >
            <Image
              source={require("../assets/iconos/maria.png")}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>Biología</Text>
          </TouchableOpacity>

          {pressedCard === 2 && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>
                Analiza la estructura, evolución y funcionamiento de los seres vivos.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.card}
            onPressIn={() => setPressedCard(3)}
            onPressOut={() => setPressedCard(null)}
          >
            <Image
              source={require("../assets/iconos/pedro.png")}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>Álgebra</Text>
          </TouchableOpacity>

          {pressedCard === 3 && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>
                Se enfoca en ecuaciones, expresiones y métodos matemáticos.
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Seguir viendo</Text>

          <View style={styles.smallCardContainer}>
            <View style={styles.smallCard}>
              <Image
                source={require("../assets/iconos/buddy.png")}
                style={styles.smallCardImage}
              />
              <View>
                <Text style={styles.smallCardTitle}>Química</Text>
                <Text style={styles.smallCardSubtitle}>Tema 3 – Avances</Text>
              </View>
            </View>

            <View style={styles.smallCard}>
              <Image
                source={require("../assets/iconos/carlos.png")}
                style={styles.smallCardImage}
              />
              <View>
                <Text style={styles.smallCardTitle}>Cálculo II</Text>
                <Text style={styles.smallCardSubtitle}>Ejercicios 12–15</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 25,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    marginBottom: 15,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 3,
    marginBottom: 10,
  },
  cardImage: {
    width: 55,
    height: 55,
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  descriptionBox: {
    backgroundColor: "#ffffffdd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  descriptionText: {
    color: "#333",
    fontSize: 14,
  },

  smallCardContainer: {
    marginBottom: 30,
    marginTop: 10,
  },
  smallCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },
  smallCardImage: {
    width: 45,
    height: 45,
    marginRight: 12,
  },
  smallCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  smallCardSubtitle: {
    fontSize: 13,
    color: "#555",
  },
});
