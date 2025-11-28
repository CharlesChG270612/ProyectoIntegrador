import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { UserController } from "../controllers/UserController";

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (!usuario.trim() || !password.trim()) {
    Alert.alert("Error", "Completa Usuario y Contraseña.");
    return;
  }

  try {
    await AsyncStorage.setItem("nombreUsuario", usuario);
    navigation.replace("Tabs");
  } catch (error) {
    console.log("Error guardando usuario:", error);
  }
};

  return (
    <LinearGradient
      colors={["#00FFD1", "#0099CC"]}
      style={styles.gradient}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Text style={styles.appTitle}>StudyBuddy</Text>
          <Text style={styles.subtitle}>Iniciar sesión</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#666"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Pressable onPress={() => navigation.navigate("RecuperarPassword")}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <Pressable 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Verificando..." : "Entrar"}</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate("Registro")}
            >
              <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.exitButton]}>
              <Text style={styles.buttonText}>Salir</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  appTitle: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    color: "#000",
    marginBottom: 40,
  },
  form: {
    width: "85%",
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  forgotText: {
    fontSize: 14,
    color: "#003399",
    marginBottom: 20,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#00C4CC",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  secondaryButton: {
    backgroundColor: "#00D6D6",
  },
  exitButton: {
    backgroundColor: "#00B2B2",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
});