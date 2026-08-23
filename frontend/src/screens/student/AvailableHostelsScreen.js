import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function AvailableHostelsScreen({ navigation }) {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  const loadHostels = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/hostels", {
        params: {
          page: 1,
          limit: 50,
          sort: "-createdAt",
        },
      });

      setHostels(response.data.hostels || []);
    } catch (error) {
      console.log("Hostels error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to load available hostels."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostels();
  }, []);

  const handleApply = async (hostelId) => {
    try {
      setApplyingId(hostelId);
      await apiClient.post("/applications", { hostel: hostelId });
      Alert.alert("Success", "Hostel application submitted successfully.");
      navigation.navigate("Application");
    } catch (error) {
      console.log("Apply hostel error:", error.response?.data || error.message);
      const message =
        error.response?.data?.message ||
        "Unable to submit hostel application.";

      if (message.toLowerCase().includes("already")) {
        navigation.navigate("Application");
        return;
      }

      Alert.alert("Application Failed", message);
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5A2B" />
          <Text style={styles.loadingText}>Loading hostels...</Text>
        </View>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Available Hostels</Text>

        {hostels.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No hostels available</Text>
            <Text style={styles.emptyText}>
              There are no hostels to display right now.
            </Text>
          </View>
        ) : (
          hostels.map((hostel) => (
            <View key={hostel._id} style={styles.card}>
              {hostel.image ? (
                <Image
                  source={{ uri: hostel.image }}
                  style={styles.hostelImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>🏢</Text>
                </View>
              )}

              <Text style={styles.hostelName}>{hostel.name}</Text>
              <Text style={styles.location}>📍 {hostel.location}</Text>

              {hostel.description ? (
                <Text style={styles.description}>{hostel.description}</Text>
              ) : null}

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Rooms: {hostel.totalRooms ?? 0}</Text>
                <Text style={styles.metaText}>
                  Available: {hostel.availableRooms ?? 0}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => handleApply(hostel._id)}
                disabled={applyingId === hostel._id}
              >
                <Text style={styles.applyButtonText}>
                  {applyingId === hostel._id ? "Applying..." : "Apply for Hostel"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.42)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  hostelImage: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    marginBottom: 14,
    backgroundColor: "#EDE3D7",
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    marginBottom: 14,
    backgroundColor: "rgba(245,237,230,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 42,
  },
  hostelName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 6,
  },
  location: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  metaText: {
    fontSize: 13,
    color: "#444",
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#F5EDE6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#8B5A2B",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyCard: {
    backgroundColor: "rgba(255,255,255,0.42)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
