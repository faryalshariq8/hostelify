import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import { theme } from "../../styles/theme";
import apiClient from "../../api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import CustomHeader from "../../components/CustomHeader";

export default function RegisterScreen({ navigation }) {
  const { checkSession } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post("/auth/register", { fullName, email, password });
      
      // Save token and user, then trigger context update
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
      await checkSession();
    } catch (error) {
      Alert.alert("Registration Failed", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <CustomHeader title="Create Account" navigation={navigation} backAction={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor={theme.colors.textSecondary}
          value={fullName}
          onChangeText={setFullName}
        />

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

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor={theme.colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.l,
    justifyContent: "center",
  },
  header: {
    marginBottom: theme.spacing.xl,
    marginTop: 20,
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
    marginTop: theme.spacing.m,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: "700",
  },
  backButton: {
    marginTop: theme.spacing.l,
    alignItems: "center",
    marginBottom: 40,
  },
  backText: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});