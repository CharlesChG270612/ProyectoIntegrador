import React, { useState } from "react";
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
import { UserController } from "../controllers/UserController";

export default function Interfaz_Registrarse({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    // Validaciones básicas
    if (!usuario.trim()) {
      Alert.alert("Falta información", "Ingresa un nombre de usuario.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Falta información", "Ingresa un correo electrónico.");
      return;
    }
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(email)) {
      Alert.alert("Correo inválido", "Ingresa un correo electrónico válido.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      Alert.alert("Contraseña débil", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    try {
      // Llamada al controlador
      const result = await UserController.registrar(usuario, email, password);

      if (result.success) {
        Alert.alert("¡Éxito!", "Tu cuenta ha sido creada. Ahora inicia sesión.", [
          { text: "OK", onPress: () => navigation.replace("Login") }
        ]);
      } else {
        Alert.alert("Error al registrar", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema técnico al intentar registrarte.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <LinearGradient
      colors={["#00f7b2", "#04e4d9", "#0fb8c4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Text style={styles.title}>StudyBuddy</Text>
          <Text style={styles.subtitle}>Registrarse</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#999"
              value={usuario}
              onChangeText={setUsuario}
            />

            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {cargando ? (
              <View style={{ alignItems: "center", marginTop: 10 }}>
                <ActivityIndicator size="large" color="#00C6FB" />
                <Text style={{ marginTop: 10, fontSize: 16 }}>Creando cuenta...</Text>
              </View>
            ) : (
              <>
                <Pressable style={styles.button} onPress={handleRegistro}>
                  <Text style={styles.buttonText}>Registrarse</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonSalir]}
                  onPress={() => navigation.replace("Login")}
                >
                  <Text style={styles.buttonText}>Volver al Login</Text>
                </Pressable>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
    color: "#000",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#16d6e0",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  buttonSalir: {
    backgroundColor: "#12c3cf",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});