import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { theme } from "../styles/theme";

export default function ScreenWrapper({ children, style }) {
  return (
    <ImageBackground
      source={{ uri: "https://res.cloudinary.com/yamb63ur/image/upload/v1786667662/bg_ggxnvh.jpg" }}
      style={[styles.background, style]}
      blurRadius={10} // Creates the beautiful blurred effect
    >
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(248, 246, 242, 0.1)", // Very slight tint for readability
  }
});
