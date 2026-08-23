import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function EditProfileScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      const response = await apiClient.get("/profile");

      setFullName(response.data.fullName || "");
      setAvatar(response.data.avatar || "");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validation", "Please enter your full name.");
      return;
    }

    try {
      setSaving(true);

      await apiClient.put("/profile", {
        fullName: fullName.trim(),
        avatar: avatar.trim(),
      });

      Alert.alert(
        "Success",
        "Profile updated successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5A2B" />

          <Text style={styles.loadingText}>
            Loading profile...
          </Text>
        </View>
      </GlassBackground>
    );
  }

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
          Edit Profile
        </Text>

        <View style={{ width: 42 }} />
      </View>

      <View style={styles.card}>

        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />

        <Text style={styles.label}>
          Avatar URL
        </Text>

        <TextInput
          style={styles.input}
          value={avatar}
          onChangeText={setAvatar}
          placeholder="Optional image URL"
          autoCapitalize="none"
        />

        <Text style={styles.helper}>
          You can leave the avatar URL empty for now.
        </Text>

      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          saving && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.saveButtonText}>
            Save Changes
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
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
    fontSize: 26,
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

  helper: {
    fontSize: 13,
    color: "#777",
    marginTop: 5,
  },

  saveButton: {
    backgroundColor: "#8B5A2B",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },

  disabledButton: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
  },
});