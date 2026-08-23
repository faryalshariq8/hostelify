import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useAuth } from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(
        email.trim(),
        password
      );
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Hostelify</Text>
        <Text style={styles.subtitle}>
          Welcome back 👋
        </Text>
      </View>

      <View style={styles.form}>

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>
              Login
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerLabel}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerButton}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  header: {
    marginBottom: 35,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#202124",
  },

  subtitle: {
    fontSize: 17,
    color: "#666",
    marginTop: 8,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 16,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#222",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 12,
  },

  forgotText: {
    color: "#8B5A2B",
    fontWeight: "600",
  },

  loginButton: {
    height: 54,
    backgroundColor: "#8B5A2B",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  loginText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  registerLabel: {
    color: "#666",
    marginRight: 5,
  },

  registerButton: {
    color: "#8B5A2B",
    fontWeight: "700",
  },
});