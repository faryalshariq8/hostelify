import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { theme } from "../../styles/theme";
import apiClient from "../../api/apiClient";

export default function ResetPasswordScreen({ route, navigation }) {
  // Can get the reset token either from route params or user input
  const initialToken = route.params?.resetToken || "";
  
  const [resetToken, setResetToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!resetToken.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter the reset token and new password");
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post("/auth/resetpassword", { resetToken, password });
      Alert.alert("Success", "Password updated successfully!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your token and new password</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Reset Token</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste your reset token"
          placeholderTextColor={theme.colors.textSecondary}
          value={resetToken}
          onChangeText={setResetToken}
          autoCapitalize="none"
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          placeholderTextColor={theme.colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Reset Password</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.l,
    justifyContent: "center",
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
  subtitle: {
    ...theme.typography.bodySecondary,
    marginTop: theme.spacing.s,
  },
  form: {
    width: "100%",
  },
  label: {
    ...theme.typography.body,
    fontWeight: "600",
    marginBottom: theme.spacing.s,
  },
  input: {
    height: 54,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
    ...theme.shadows.soft,
  },
  button: {
    height: 54,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.m,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.medium,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: "700",
  },
  backButton: {
    marginTop: theme.spacing.l,
    alignItems: "center",
  },
  backText: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
