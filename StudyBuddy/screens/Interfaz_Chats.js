import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

export default function Interfaz_Chats() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={["#00f7b2", "#04e4d9", "#0fb8c4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Chat Grupal</Text>
            </View>

            <ScrollView style={styles.chatArea}>
              <View style={styles.rowLeft}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/50?img=1" }}
                  style={styles.avatar}
                />

                <View style={styles.messageBoxLeft}>
                  <Text style={styles.messageTitle}>Cálculo Integral</Text>
                  <Text style={styles.messageText}>
                    Hola a todos, ¿alguien me puede explicar el Teorema del Valor
                    Medio? No entiendo bien cuándo se aplica.
                  </Text>
                </View>
              </View>

              <View style={styles.rowRight}>
                <View style={styles.messageBoxRight}>
                  <Text style={styles.messageTitle}>Cálculo Integral</Text>
                  <Text style={styles.messageText}>
                    Claro. Se aplica si la función f(x) es continua en [a, b] y
                    derivable en (a, b). Dice que existe un punto c donde la
                    pendiente de la tangente es igual a la de la secante.
                  </Text>
                </View>

                <Image
                  source={{ uri: "https://i.pravatar.cc/50?img=2" }}
                  style={styles.avatar}
                />
              </View>

              <View style={styles.rowLeft}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/50?img=1" }}
                  style={styles.avatar}
                />

                <View style={styles.messageBoxLeft}>
                  <Text style={styles.messageTitle}>Cálculo Integral</Text>
                  <Text style={styles.messageText}>Gracias amigo!</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 10,
  },
  rowLeft: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "flex-start",
  },
  rowRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 10,
    alignItems: "flex-start",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  messageBoxLeft: {
    backgroundColor: "#eae3f5",
    padding: 15,
    borderRadius: 20,
    maxWidth: "70%",
  },
  messageBoxRight: {
    backgroundColor: "#eae3f5",
    padding: 15,
    borderRadius: 20,
    maxWidth: "70%",
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: "#333",
  },
});
