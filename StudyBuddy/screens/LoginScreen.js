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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// Importamos el controlador real
import { UserController } from "../controllers/UserController";

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !password.trim()) {
      Alert.alert("Campos vacíos", "Por favor completa usuario y contraseña.");
      return;
    }

    setLoading(true);

    try {
      // 1. LLAMADA REAL A LA BASE DE DATOS
      const response = await UserController.login(usuario, password);

      if (response.success) {
        // 2. Si las credenciales son correctas, guardamos y navegamos
        await AsyncStorage.setItem("nombreUsuario", response.user.usuario);
        // Opcional: guardar otros datos como carrera o ID si los necesitas
        if (response.user.carrera)
          await AsyncStorage.setItem("carreraUsuario", response.user.carrera);

        navigation.replace("Tabs");
      } else {
        // 3. Si falló (usuario no existe o pass incorrecta)
        Alert.alert("Acceso denegado", response.message);
      }
    } catch (error) {
      console.log("Error en login:", error);
      Alert.alert("Error", "Ocurrió un problema técnico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#00FFD1", "#0099CC"]} style={styles.gradient}>
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
              placeholder="Tu nombre de usuario"
              placeholderTextColor="#999"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••"
              placeholderTextColor="#999"
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
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate("Registro")}
            >
              <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, alignItems: "center", paddingTop: 80 },
  appTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  subtitle: { fontSize: 20, color: "#000", marginBottom: 40, opacity: 0.8 },
  form: { width: "85%" },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
    fontWeight: "600",
    marginLeft: 4,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  forgotText: {
    fontSize: 14,
    color: "#004466",
    marginBottom: 25,
    textAlign: "right",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#00C4CC",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  buttonDisabled: { opacity: 0.7 },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#00C4CC",
  },
  buttonText: { color: "#000", fontSize: 18, fontWeight: "bold" },
});
