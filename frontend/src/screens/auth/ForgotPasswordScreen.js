import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { theme } from "../../styles/theme";
import apiClient from "../../api/apiClient";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post("/auth/forgotpassword", { email });
      Alert.alert("Success", res.data.message || "Reset token generated (Check console/response)");
      navigation.navigate("ResetPassword", { resetToken: res.data.resetToken });
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email to reset your password</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@student.com"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Get Reset Token</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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