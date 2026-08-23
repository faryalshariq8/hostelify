import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";

const BACKGROUND_IMAGE =
  "https://res.cloudinary.com/yamb63ur/image/upload/v1786667662/bg_ggxnvh.jpg";

export default function GlassBackground({ children }) {
  return (
    <ImageBackground
      source={{ uri: BACKGROUND_IMAGE }}
      style={styles.background}
      resizeMode="cover"
    >
      <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
});
