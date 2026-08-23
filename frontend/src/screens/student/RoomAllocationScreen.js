import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function RoomAllocationScreen() {
  const [allocation, setAllocation] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const loadAllocation = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(
        "/dashboard/allocation"
      );

      setAllocation(response.data);
    } catch (error) {
      console.log(
        "Allocation error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load room allocation."
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAllocation();
  }, []);

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5A2B" />

          <Text style={styles.loadingText}>
            Loading room information...
          </Text>
        </View>
      </GlassBackground>
    );
  }

  if (!allocation) {
    return (
      <GlassBackground>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No Room Allocated
          </Text>

          <Text style={styles.emptyText}>
            You don't currently have an active room allocation.
          </Text>
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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          🛏 Room Allocation
        </Text>

        <Text style={styles.label}>
          Room Number
        </Text>

        <Text style={styles.value}>
          {allocation.room?.roomNumber ||
            allocation.roomNumber ||
            "Not available"}
        </Text>

        <Text style={styles.label}>
          Hostel
        </Text>

        <Text style={styles.value}>
          {allocation.hostel?.name ||
            allocation.hostelName ||
            "Not available"}
        </Text>

        {allocation.room?.capacity && (
          <>
            <Text style={styles.label}>
              Capacity
            </Text>

            <Text style={styles.value}>
              {allocation.room.capacity}
            </Text>
          </>
        )}

        {allocation.room?.occupied !== undefined && (
          <>
            <Text style={styles.label}>
              Occupied
            </Text>

            <Text style={styles.value}>
              {allocation.room.occupied}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 25,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginTop: 15,
    marginBottom: 5,
  },

  value: {
    fontSize: 18,
    fontWeight: "600",
  },
});