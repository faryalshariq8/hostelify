import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/profile");

      setProfile(response.data);
    } catch (error) {
      console.log(
        "Profile error:",
        error.response?.data || error.message
      );

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
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProfile();
    });

    return unsubscribe;
  }, [navigation]);

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

  if (!profile) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <Text>Unable to load profile.</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={fetchProfile}
          >
            <Text style={styles.buttonText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground>
      <View style={styles.container}>

      {/* Header */}
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
          My Profile
        </Text>

        <View style={{ width: 42 }} />
      </View>

      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
        </Text>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>

        <Text style={styles.label}>
          Full Name
        </Text>

        <Text style={styles.value}>
          {profile.fullName}
        </Text>

        <Text style={styles.label}>
          Email
        </Text>

        <Text style={styles.value}>
          {profile.email}
        </Text>

        <Text style={styles.label}>
          Role
        </Text>

        <Text style={styles.value}>
          {profile.role}
        </Text>

      </View>

      {/* Edit Profile */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.buttonText}>
          ✏️ Edit Profile
        </Text>
      </TouchableOpacity>

      {/* Change Password */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("ChangePassword")}
      >
        <Text style={styles.secondaryButtonText}>
          🔐 Change Password
        </Text>
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
    backgroundColor: "transparent",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
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

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#8B5A2B",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 25,
  },

  avatarText: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    elevation: 3,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginTop: 10,
    marginBottom: 4,
  },

  value: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
  },

  button: {
    backgroundColor: "#8B5A2B",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    backgroundColor: "#F5EDE6",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#8B5A2B",
    fontSize: 16,
    fontWeight: "700",
  },
});