import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function ChangePasswordScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert(
        "Validation",
        "Please fill in all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Validation",
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Validation",
        "New passwords do not match."
      );
      return;
    }

    try {
      setSaving(true);

      await apiClient.put("/profile/password", {
        oldPassword,
        newPassword,
      });

      Alert.alert(
        "Success",
        "Password updated successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert(
        "Password Update Failed",
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassBackground>
      <View style={styles.container}>

        <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Change Password
        </Text>

        <View style={{ width: 42 }} />
      </View>

      <View style={styles.card}>

        <Text style={styles.label}>
          Current Password
        </Text>

        <TextInput
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
          placeholder="Enter current password"
        />

        <Text style={styles.label}>
          New Password
        </Text>

        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Enter new password"
        />

        <Text style={styles.label}>
          Confirm New Password
        </Text>

        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm new password"
        />

      </View>

      <TouchableOpacity
        style={[
          styles.button,
          saving && styles.disabledButton,
        ]}
        onPress={handleChangePassword}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            🔐 Update Password
          </Text>
        )}
      </TouchableOpacity>

      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#F5EDE6",
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    fontSize: 25,
    color: "#8B5A2B",
    fontWeight: "700",
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#222",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 22,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginBottom: 8,
    marginTop: 8,
  },

  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E0E4EC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: "#222",
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#8B5A2B",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
  },
});