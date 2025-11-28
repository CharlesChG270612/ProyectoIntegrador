import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
  TextInput,
  Animated,
  PanResponder,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MatchingScreen() {
  // Estados para matching
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  
  // Estados para preferencias y conexiones
  const [conexiones, setConexiones] = useState([
    { id: "conexion-1", nombre: "Carlos", materia: "Cálculo", porcentaje: 95, img: require("../assets/iconos/carlos.png") },
    { id: "conexion-2", nombre: "María", materia: "Biología", porcentaje: 82, img: require("../assets/iconos/maria.png") },
    { id: "conexion-3", nombre: "Pedro", materia: "Física", porcentaje: 97, img: require("../assets/iconos/pedro.png") },
  ]);

  const [preferencias, setPreferencias] = useState([
    { id: "pref-1", titulo: "Cálculo", valor: 93 },
    { id: "pref-2", titulo: "Física", valor: 85 },
    { id: "pref-3", titulo: "Biología", valor: 72 },
    { id: "pref-4", titulo: "Programación", valor: 78 },
  ]);

  const [activeTab, setActiveTab] = useState("conexiones"); // Por defecto conexiones
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingPreferencia, setEditingPreferencia] = useState(null);
  const [nuevaPreferencia, setNuevaPreferencia] = useState({
    titulo: "",
    valor: 50
  });

  // Datos de ejemplo para las cards de matching
  const users = [
    {
      id: "user-1", 
      nombre: "Luisa", 
      materia: "Cálculo", 
      porcentaje: 93, 
      img: require("../assets/iconos/buddy.png"),
      descripcion: "Interesada en cálculo diferencial y multivariable.",
      edad: "22 años"
    },
    {
      id: "user-2", 
      nombre: "Carlos", 
      materia: "Física", 
      porcentaje: 88, 
      img: require("../assets/iconos/carlos.png"),
      descripcion: "Busco compañeros para mecánica clásica.",
      edad: "24 años"
    },
    {
      id: "user-3", 
      nombre: "María", 
      materia: "Biología", 
      porcentaje: 95, 
      img: require("../assets/iconos/maria.png"),
      descripcion: "Apasionada por genética y biología molecular.",
      edad: "21 años"
    }
  ];

  // Animaciones
  const swipeAnim = useRef(new Animated.ValueXY()).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heartBeatAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // PanResponder para gestos de swipe
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        swipeAnim.setValue({ x: gestureState.dx, y: 0 });
        const rotate = gestureState.dx * 0.1;
        rotateAnim.setValue(rotate);
      },
      onPanResponderRelease: (_, gestureState) => {
        // Verificar que aún hay cards disponibles
        if (currentCardIndex >= users.length) return;
        
        if (gestureState.dx > 100) {
          handleSwipeRight();
        } else if (gestureState.dx < -100) {
          handleSwipeLeft();
        } else {
          resetCardPosition();
        }
      },
    })
  ).current;

  // Animación de swipe derecho (LIKE)
  const handleSwipeRight = () => {
    Animated.parallel([
      Animated.timing(swipeAnim.x, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 30,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      handleLike();
    });
  };

  // Animación de swipe izquierdo (DISLIKE)
  const handleSwipeLeft = () => {
    Animated.parallel([
      Animated.timing(swipeAnim.x, {
        toValue: -500,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: -30,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      handleDislike();
    });
  };

  // Resetear posición de la card
  const resetCardPosition = () => {
    Animated.parallel([
      Animated.spring(swipeAnim.x, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Animación de pulso para el botón de like
  const animateHeartBeat = () => {
    Animated.sequence([
      Animated.timing(heartBeatAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartBeatAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Animación de match
  const showMatchAnimationFunc = (matchedUser) => {
    setShowMatchAnimation(true);
    fadeAnim.setValue(0);
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowMatchAnimation(false);
    });
  };

  // HANDLE LIKE
  const handleLike = () => {
    // Verificar que aún hay cards disponibles
    if (currentCardIndex >= users.length) return;
    
    animateHeartBeat();
    const currentUser = users[currentCardIndex];
    
    // Verificar si ya existe en conexiones para evitar duplicados
    const alreadyExists = conexiones.some(conexion => conexion.id === currentUser.id);
    
    if (!alreadyExists) {
      // Simular match (50% de probabilidad)
      const isMatch = Math.random() > 0.5;
      
      if (isMatch) {
        setMatches(prev => [...prev, currentUser]);
        // Agregar a conexiones también
        setConexiones(prev => [...prev, currentUser]);
        showMatchAnimationFunc(currentUser);
      }
    }
    
    // Pasar a la siguiente card
    setTimeout(() => {
      if (currentCardIndex < users.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        resetCardPosition();
      } else {
        setCurrentCardIndex(prev => prev + 1); // Marcar como finalizado
        Alert.alert("¡Fin!", "Has visto todos los perfiles disponibles");
      }
    }, 800);
  };

  // HANDLE DISLIKE
  const handleDislike = () => {
    // Verificar que aún hay cards disponibles
    if (currentCardIndex >= users.length) return;
    
    if (currentCardIndex < users.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      resetCardPosition();
    } else {
      setCurrentCardIndex(prev => prev + 1); // Marcar como finalizado
      Alert.alert("¡Fin!", "Has visto todos los perfiles disponibles");
    }
  };

  // HANDLE CHAT - MODIFICADO: Ahora permite chatear sin match
  const handleChat = () => {
    // Verificar que aún hay cards disponibles
    if (currentCardIndex >= users.length) {
      Alert.alert("Sin perfiles", "No hay perfiles disponibles para chatear");
      return;
    }
    
    const currentUser = users[currentCardIndex];
    
    // Permitir chatear directamente sin necesidad de match
    setShowChatModal(true);
    
    // Si no es un match, mostrar mensaje informativo
    const isMatch = matches.some(match => match.id === currentUser.id);
    if (!isMatch) {
      // Opcional: Mostrar un mensaje de que es un chat de prueba
      setTimeout(() => {
        Alert.alert(
          "Chat con usuario",
          "Estás en un chat con un usuario",
          [{ text: "Entendido" }]
        );
      }, 500);
    }
  };

  // CHAT CON CONEXIONES DESDE LA LISTA
  const handleChatFromConnections = (user) => {
    setShowChatModal(true);
    // Podrías guardar el usuario actual del chat en un estado separado si quieres
  };

  // FUNCIONES PARA PREFERENCIAS
  const eliminarConexion = (id) => {
    Alert.alert(
      "Eliminar Conexión",
      "¿Estás seguro de que quieres eliminar esta conexión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            setConexiones(conexiones.filter(conexion => conexion.id !== id));
            setMatches(matches.filter(match => match.id !== id));
          }
        }
      ]
    );
  };

  const eliminarPreferencia = (id) => {
    Alert.alert(
      "Eliminar Preferencia",
      "¿Estás seguro de que quieres eliminar esta preferencia?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            setPreferencias(preferencias.filter(pref => pref.id !== id));
          }
        }
      ]
    );
  };

  const editarPreferencia = (preferencia) => {
    setEditingPreferencia({...preferencia});
    setModalVisible(true);
  };

  const guardarPreferencia = () => {
    if (editingPreferencia) {
      if (editingPreferencia.titulo.trim() === "") {
        Alert.alert("Error", "Por favor ingresa un nombre para la preferencia");
        return;
      }

      setPreferencias(preferencias.map(p => 
        p.id === editingPreferencia.id 
          ? { 
              ...p, 
              titulo: editingPreferencia.titulo.trim(),
              valor: Math.min(100, Math.max(0, editingPreferencia.valor)) 
            }
          : p
      ));
      setModalVisible(false);
      setEditingPreferencia(null);
    }
  };

  const actualizarNombrePreferencia = (texto) => {
    if (editingPreferencia) {
      setEditingPreferencia({
        ...editingPreferencia,
        titulo: texto
      });
    }
  };

  const actualizarValorPreferencia = (nuevoValor) => {
    if (editingPreferencia) {
      setEditingPreferencia({
        ...editingPreferencia,
        valor: Math.min(100, Math.max(0, nuevoValor))
      });
    }
  };

  const agregarPreferencia = () => {
    if (nuevaPreferencia.titulo.trim() === "") {
      Alert.alert("Error", "Por favor ingresa un nombre para la preferencia");
      return;
    }

    const nuevaPref = {
      id: `pref-${Date.now()}`,
      titulo: nuevaPreferencia.titulo.trim(),
      valor: nuevaPreferencia.valor
    };

    setPreferencias([...preferencias, nuevaPref]);
    setAddModalVisible(false);
    setNuevaPreferencia({ titulo: "", valor: 50 });
  };

  // Renderizar conexiones - MODIFICADO: Ahora incluye botón de chat
  const renderConexion = ({ item }) => (
    <View style={styles.connectionCard}>
      <Image source={item.img} style={styles.connectionImg} contentFit="cover" />
      <View style={styles.connectionInfo}>
        <Text style={styles.connectionName}>{item.nombre}</Text>
        <Text style={styles.connectionMateria}>{item.materia}</Text>
        <View style={styles.percentageBadge}>
          <Text style={styles.percentageText}>{item.porcentaje}%</Text>
        </View>
      </View>
      <View style={styles.connectionActions}>
        <TouchableOpacity 
          style={styles.chatFromListButton}
          onPress={() => handleChatFromConnections(item)}
        >
          <Ionicons name="chatbubble" size={16} color="#0099CC" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => eliminarConexion(item.id)}
        >
          <Ionicons name="close-circle" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizar preferencias
  const renderPreferencia = (p) => (
    <View key={p.id} style={styles.prefContainer}>
      <View style={styles.prefHeader}>
        <Text style={styles.prefLabel}>{p.titulo}</Text>
        <View style={styles.prefActions}>
          <Text style={styles.prefValue}>{p.valor}%</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => editarPreferencia(p)}
          >
            <Ionicons name="create-outline" size={16} color="#0099CC" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deletePrefButton}
            onPress={() => eliminarPreferencia(p.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.prefBar}>
        <LinearGradient 
          colors={["#00FFD1", "#0099CC"]}
          style={[styles.prefFill, { width: `${p.valor}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </View>
  );

  // Transformaciones para animaciones
  const cardStyle = {
    transform: [
      { translateX: swipeAnim.x },
      { rotate: rotateAnim.interpolate({
        inputRange: [-30, 0, 30],
        outputRange: ['-30deg', '0deg', '30deg']
      })}
    ]
  };

  const heartStyle = {
    transform: [{ scale: heartBeatAnim }]
  };

  const matchAnimationStyle = {
    opacity: fadeAnim
  };

  // Verificar si hay usuario actual disponible
  const hasCurrentUser = currentCardIndex < users.length;
  const currentUser = hasCurrentUser ? users[currentCardIndex] : null;

  return (
    <LinearGradient colors={["#00FFD1", "#0099CC"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Compacto */}
          <View style={styles.header}>
            <Text style={styles.title}>StudyBuddy</Text>
            <Text style={styles.subtitle}>Encuentra tu compañero ideal</Text>
          </View>

          {/* SECCIÓN PRINCIPAL DE MATCHING (SIEMPRE VISIBLE) */}
          <View style={styles.matchingSection}>
            <Text style={styles.sectionTitle}>Encuentra StudyBuddies</Text>
            
            {/* CARD DE MATCHING */}
            <View style={styles.cardContainer}>
              {hasCurrentUser ? (
                <Animated.View 
                  style={[styles.card, cardStyle]}
                  {...panResponder.panHandlers}
                >
                  <View style={styles.cardHeader}>
                    <Image source={currentUser.img} style={styles.buddyImage} contentFit="cover" />
                    <View style={styles.cardTitle}>
                      <Text style={styles.cardName}>{currentUser.nombre}</Text>
                      <Text style={styles.cardPercent}>{currentUser.porcentaje}%</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.cardDescription}>{currentUser.descripcion}</Text>

                  <View style={styles.swipeIndicators}>
                    <View style={[styles.swipeIndicator, styles.dislikeIndicator]}>
                      <Ionicons name="close" size={20} color="#FF6B6B" />
                    </View>
                    <View style={[styles.swipeIndicator, styles.likeIndicator]}>
                      <Ionicons name="heart" size={20} color="#4ECDC4" />
                    </View>
                  </View>
                </Animated.View>
              ) : (
                <View style={[styles.card, styles.emptyCard]}>
                  <Ionicons name="people-outline" size={40} color="#ccc" />
                  <Text style={styles.emptyCardText}>No hay más perfiles disponibles</Text>
                  <TouchableOpacity 
                    style={styles.resetButton}
                    onPress={() => setCurrentCardIndex(0)}
                  >
                    <Text style={styles.resetButtonText}>Reiniciar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Animación de Match */}
              {showMatchAnimation && hasCurrentUser && (
                <Animated.View style={[styles.matchAnimation, matchAnimationStyle]}>
                  <LinearGradient colors={['rgba(78, 205, 196, 0.9)', 'rgba(0, 153, 204, 0.9)']} style={styles.matchGradient}>
                    <Ionicons name="heart" size={50} color="#fff" />
                    <Text style={styles.matchText}>¡MATCH!</Text>
                    <Text style={styles.matchSubtext}>Ahora puedes chatear con {currentUser.nombre}</Text>
                  </LinearGradient>
                </Animated.View>
              )}
            </View>

            {/* Botones de Acción */}
            {hasCurrentUser ? (
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]} onPress={handleDislike}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLike}>
                  <Animated.View style={heartStyle}>
                    <Ionicons name="heart" size={28} color="#fff" />
                  </Animated.View>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.actionButton, styles.chatButton]} onPress={handleChat}>
                  <Ionicons name="chatbubble" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.resetButtonLarge]}
                  onPress={() => setCurrentCardIndex(0)}
                >
                  <Ionicons name="refresh" size={24} color="#fff" />
                  <Text style={styles.resetButtonLargeText}>Reiniciar</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Mini Contador de Matches */}
            {matches.length > 0 && (
              <View style={styles.matchesMini}>
                <Text style={styles.matchesMiniText}>{matches.length} matches</Text>
              </View>
            )}
          </View>

          {/* TABS SECUNDARIAS - SOLO CONEXIONES Y PREFERENCIAS */}
          <View style={styles.secondaryTabsContainer}>
            <TouchableOpacity 
              style={[styles.secondaryTab, activeTab === "conexiones" && styles.activeSecondaryTab]}
              onPress={() => setActiveTab("conexiones")}
            >
              <Ionicons 
                name="people" 
                size={18} 
                color={activeTab === "conexiones" ? "#fff" : "#0099CC"} 
              />
              <Text style={[styles.secondaryTabText, activeTab === "conexiones" && styles.activeSecondaryTabText]}>
                Mis Conexiones
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryTab, activeTab === "preferencias" && styles.activeSecondaryTab]}
              onPress={() => setActiveTab("preferencias")}
            >
              <Ionicons 
                name="settings" 
                size={18} 
                color={activeTab === "preferencias" ? "#fff" : "#0099CC"} 
              />
              <Text style={[styles.secondaryTabText, activeTab === "preferencias" && styles.activeSecondaryTabText]}>
                Preferencias
              </Text>
            </TouchableOpacity>
          </View>

          {/* CONTENIDO DE LAS TABS SECUNDARIAS */}
          <View style={styles.secondaryContent}>
            {activeTab === "conexiones" ? (
              <View style={styles.tabContent}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Tus Conexiones ({conexiones.length})</Text>
                </View>
                <FlatList
                  data={conexiones}
                  keyExtractor={(item) => item.id}
                  renderItem={renderConexion}
                  scrollEnabled={false}
                  contentContainerStyle={styles.connectionsGrid}
                />
              </View>
            ) : (
              <View style={styles.tabContent}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Tus Preferencias ({preferencias.length})</Text>
                  <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
                    <Ionicons name="add-circle" size={20} color="#0099CC" />
                  </TouchableOpacity>
                </View>
                
                {preferencias.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="school-outline" size={40} color="#ccc" />
                    <Text style={styles.emptyStateText}>No tienes preferencias</Text>
                    <TouchableOpacity style={styles.emptyStateButton} onPress={() => setAddModalVisible(true)}>
                      <Text style={styles.emptyStateButtonText}>Agregar Preferencia</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.preferencesList}>
                    {preferencias.map(renderPreferencia)}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* MODALES */}
          <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Editar Preferencia</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nombre</Text>
                  <TextInput style={styles.textInput} value={editingPreferencia?.titulo || ''} onChangeText={actualizarNombrePreferencia} />
                </View>
                <View style={styles.sliderContainer}>
                  <Text style={styles.inputLabel}>Interés: {editingPreferencia?.valor || 0}%</Text>
                  <View style={styles.sliderButtons}>
                    {[-10, -1, 1, 10].map((value, index) => (
                      <TouchableOpacity key={index} style={styles.sliderButton} onPress={() => actualizarValorPreferencia((editingPreferencia?.valor || 0) + value)}>
                        <Text style={styles.sliderButtonText}>{value > 0 ? `+${value}` : value}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.previewBar}>
                    <LinearGradient colors={["#00FFD1", "#0099CC"]} style={[styles.previewFill, { width: `${editingPreferencia?.valor || 0}%` }]} />
                  </View>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={guardarPreferencia}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal animationType="slide" transparent={true} visible={addModalVisible} onRequestClose={() => setAddModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Nueva Preferencia</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nombre</Text>
                  <TextInput style={styles.textInput} placeholder="Ej: Matemáticas..." value={nuevaPreferencia.titulo} onChangeText={(text) => setNuevaPreferencia({...nuevaPreferencia, titulo: text})} />
                </View>
                <View style={styles.sliderContainer}>
                  <Text style={styles.inputLabel}>Interés: {nuevaPreferencia.valor}%</Text>
                  <View style={styles.sliderButtons}>
                    {[-10, -1, 1, 10].map((value, index) => (
                      <TouchableOpacity key={index} style={styles.sliderButton} onPress={() => setNuevaPreferencia({...nuevaPreferencia, valor: Math.min(100, Math.max(0, nuevaPreferencia.valor + value))})}>
                        <Text style={styles.sliderButtonText}>{value > 0 ? `+${value}` : value}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.previewBar}>
                    <LinearGradient colors={["#00FFD1", "#0099CC"]} style={[styles.previewFill, { width: `${nuevaPreferencia.valor}%` }]} />
                  </View>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setAddModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={agregarPreferencia}>
                    <Text style={styles.saveButtonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal animationType="slide" transparent={true} visible={showChatModal} onRequestClose={() => setShowChatModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.chatModal}>
                <View style={styles.chatHeader}>
                  {hasCurrentUser && (
                    <>
                      <Image source={currentUser.img} style={styles.chatUserImage} contentFit="cover" />
                      <View>
                        <Text style={styles.chatUserName}>{currentUser.nombre}</Text>
                        <Text style={styles.chatUserStatus}>En línea</Text>
                      </View>
                    </>
                  )}
                  <TouchableOpacity style={styles.closeChatButton} onPress={() => setShowChatModal(false)}>
                    <Ionicons name="close" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                <View style={styles.chatMessages}>
                  <View style={[styles.message, styles.receivedMessage]}>
                    <Text style={styles.messageText}>¡Hola! Me encantaría estudiar contigo</Text>
                  </View>
                  <View style={[styles.message, styles.sentMessage]}>
                    <Text style={[styles.messageText, styles.sentMessageText]}>¡Perfecto! ¿Qué día te viene bien?</Text>
                  </View>
                </View>
                <View style={styles.chatInputContainer}>
                  <TextInput style={styles.chatInput} placeholder="Escribe un mensaje..." placeholderTextColor="#999" />
                  <TouchableOpacity style={styles.sendButton}>
                    <Ionicons name="send" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 12,
    paddingTop: 40,
    paddingBottom: 20,
  },

  // Header Compacto
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 12,
    color: "#000",
    opacity: 0.8,
    marginTop: 2,
  },

  // SECCIÓN PRINCIPAL DE MATCHING
  matchingSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
    textAlign: 'center',
  },

  // CARD COMPACTA
  cardContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
    padding: 15,
    width: '100%',
    minHeight: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  emptyCardText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#0099CC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buddyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  cardTitle: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  cardPercent: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0099CC",
  },
  cardDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    marginBottom: 8,
  },
  swipeIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    opacity: 0.5,
  },
  swipeIndicator: {
    padding: 6,
    borderRadius: 15,
  },
  dislikeIndicator: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  likeIndicator: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },

  // Botones Compactos
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dislikeButton: { 
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
  },
  likeButton: { 
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#4ECDC4',
  },
  chatButton: { 
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#96CEB4',
  },
  resetButtonLarge: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0099CC',
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  resetButtonLargeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },

  // Mini Matches
  matchesMini: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'center',
  },
  matchesMiniText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0099CC',
  },

  // Animación de Match Compacta
  matchAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  matchGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  matchText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  matchSubtext: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },

  // TABS SECUNDARIAS
  secondaryTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0099CC',
  },
  activeSecondaryTab: {
    backgroundColor: '#0099CC',
    borderColor: '#0099CC',
  },
  secondaryTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0099CC',
    marginLeft: 6,
  },
  activeSecondaryTabText: {
    color: '#fff',
  },

  // CONTENIDO SECUNDARIO
  secondaryContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabContent: {
    minHeight: 200,
  },

  // Conexiones Compactas - MODIFICADO: Ahora con botón de chat
  connectionsGrid: {
    paddingBottom: 5,
  },
  connectionCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  connectionImg: { 
    width: 40, 
    height: 40, 
    borderRadius: 20,
    marginRight: 10,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: { 
    fontWeight: "600", 
    fontSize: 14,
    marginBottom: 1,
  },
  connectionMateria: { 
    fontSize: 10, 
    color: "#666",
    marginBottom: 3,
  },
  percentageBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  percentageText: {
    fontSize: 10,
    color: '#0099CC',
    fontWeight: 'bold',
  },
  connectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatFromListButton: {
    padding: 6,
    marginRight: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
  },
  deleteButton: {
    padding: 3,
  },

  // Preferencias Compactas
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    padding: 3,
  },
  preferencesList: {},
  prefContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  prefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  prefActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefLabel: { 
    fontWeight: "600", 
    fontSize: 14,
  },
  prefValue: {
    fontSize: 12,
    color: '#0099CC',
    fontWeight: 'bold',
    marginRight: 6,
  },
  editButton: {
    padding: 3,
    marginRight: 4,
  },
  deletePrefButton: {
    padding: 3,
  },
  prefBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
  },
  prefFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Empty State Compacto
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  emptyStateButton: {
    backgroundColor: '#0099CC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },

  // MODALES
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  sliderContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  sliderButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 45,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 3,
  },
  sliderButtonText: {
    color: '#0099CC',
    fontWeight: 'bold',
    fontSize: 11,
  },
  previewBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
    width: '100%',
    marginTop: 8,
  },
  previewFill: {
    height: "100%",
    borderRadius: 3,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#0099CC',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  // Chat Modal Compacto
  chatModal: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 15,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatUserImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 8,
  },
  chatUserName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatUserStatus: {
    fontSize: 11,
    color: '#4ECDC4',
  },
  closeChatButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  chatMessages: {
    flex: 1,
    padding: 12,
  },
  message: {
    maxWidth: '80%',
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0099CC',
  },
  messageText: {
    fontSize: 12,
    color: '#333',
  },
  sentMessageText: {
    color: '#fff',
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 12,
  },
  sendButton: {
    backgroundColor: '#0099CC',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});