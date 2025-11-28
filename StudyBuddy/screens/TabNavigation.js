import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import InicioScreen from "./Interfaz_Inicio";
import ChatsScreen from "./Interfaz_Chats";
import MatchingScreen from "./MatchingScreen";
import AjustesScreen from "./AjustesScreen";
import TendenciasScreen from "./Tendencias";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0099CC",
        tabBarInactiveTintColor: "#777",
        tabBarStyle: {
          height: 80,
          paddingBottom: 8,
          paddingTop: 0,
        },

        tabBarIcon: ({ color, size }) => {
          if (route.name === "Tendencias") return <Ionicons name="trending-up-outline" size={28} color={color} />;
          if (route.name === "Inicio") return <Ionicons name="home" size={28} color={color} />;
          if (route.name === "Chats") return <Ionicons name="chatbubbles" size={28} color={color} />;
          if (route.name === "Matching") return <Ionicons name="heart" size={28} color={color} />;
          if (route.name === "Ajustes") return <Ionicons name="settings" size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Tendencias" component={TendenciasScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Matching" component={MatchingScreen} />
      <Tab.Screen name="Ajustes" component={AjustesScreen} />
    </Tab.Navigator>
  );
}
