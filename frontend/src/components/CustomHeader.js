import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const BackIcon = () => (
  <Text style={styles.backArrow}>←</Text>
);

export default function CustomHeader({ title, navigation, backAction }) {
  const { logout } = useAuth();

  const insets = useSafeAreaInsets();
  
  const handleBack = () => {
    if (backAction) {
      backAction();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If we're at the root (Dashboard), clicking back acts as a logout
      logout();
    }
  };

  return (
    <BlurView
      intensity={35}
      tint="light"
      style={[styles.container, { paddingTop: insets.top, height: 60 + insets.top }]}
    >
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <BackIcon />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.25)",
  },
  backButton: {
    marginRight: 16,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  backArrow: {
    color: "#111",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    includeFontPadding: false,
    lineHeight: 26,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },
});
