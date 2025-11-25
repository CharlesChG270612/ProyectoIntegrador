import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import Interfaz_Registrarse from "./screens/Interfaz_Registrarse";
import RecuperarPasswordScreen from "./screens/RecuperarPasswordScreen"
import TabNavigation from "./screens/TabNavigation";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={Interfaz_Registrarse} />
          <Stack.Screen name="RecuperarPassword" component={RecuperarPasswordScreen} />
          <Stack.Screen name="Tabs" component={TabNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
