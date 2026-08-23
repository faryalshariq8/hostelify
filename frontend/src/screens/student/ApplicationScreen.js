import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function ApplicationScreen({ navigation }) {
  const [application, setApplication] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const loadApplication = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/dashboard/application");

      setApplication(response.data);
    } catch (error) {
      console.log(
        "Application error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load application information."
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadApplication();
  }, []);

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5A2B" />
          <Text style={styles.loadingText}>
            Loading application...
          </Text>
        </View>
      </GlassBackground>
    );
  }

  if (!application) {
    return (
      <GlassBackground>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No Application Found
          </Text>

          <Text style={styles.emptyText}>
            You haven't submitted a hostel application yet.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("AvailableHostels")}
          >
            <Text style={styles.buttonText}>
              View Hostels
            </Text>
          </TouchableOpacity>
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
            🏠 Hostel Application
          </Text>

          {application.hostel?.image && (
            <Image
              source={{ uri: application.hostel.image }}
              style={styles.hostelImage}
              resizeMode="cover"
            />
          )}

          <Text style={styles.label}>
            Status
          </Text>

          <Text style={styles.status}>
            {application.status || "Pending"}
          </Text>

          {application.hostel && (
            <>
              <Text style={styles.label}>
                Hostel
              </Text>

              <Text style={styles.value}>
                {application.hostel.name ||
                  application.hostel.hostelName ||
                  "Not available"}
              </Text>
            </>
          )}

          {application.createdAt && (
            <>
              <Text style={styles.label}>
                Application Date
              </Text>

              <Text style={styles.value}>
                {new Date(
                  application.createdAt
                ).toLocaleDateString()}
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
    backgroundColor: "transparent",
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
    marginBottom: 25,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.42)",
    borderRadius: 24,
    padding: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  hostelImage: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    marginBottom: 18,
    backgroundColor: "#E9E0D4",
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    marginBottom: 18,
    backgroundColor: "rgba(245,237,230,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 42,
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
    fontSize: 17,
    fontWeight: "600",
  },

  status: {
    fontSize: 18,
    fontWeight: "800",
    color: "#8B5A2B",
  },

  button: {
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});