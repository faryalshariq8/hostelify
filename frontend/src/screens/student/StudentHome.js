import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";

import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function StudentHome({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [application, setApplication] = useState(null);
  const [allocation, setAllocation] = useState(null);

  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [profileResponse, applicationResponse, allocationResponse] =
        await Promise.allSettled([
          apiClient.get("/dashboard/profile"),
          apiClient.get("/dashboard/application"),
          apiClient.get("/dashboard/allocation"),
        ]);

      // Profile
      if (profileResponse.status === "fulfilled") {
        console.log("PROFILE DASHBOARD RESPONSE:", profileResponse.value.data);
        setProfile(profileResponse.value.data);
      } else {
        console.log(
          "Profile error:",
          profileResponse.reason?.response?.data ||
            profileResponse.reason?.message
        );
      }

      // Application
      if (applicationResponse.status === "fulfilled") {
        setApplication(applicationResponse.value.data);
      } else {
        const status = applicationResponse.reason?.response?.status;

        if (status === 404) {
          setApplication(null);
        } else {
          console.log(
            "Application error:",
            applicationResponse.reason?.response?.data ||
              applicationResponse.reason?.message
          );
        }
      }

      // Allocation
      if (allocationResponse.status === "fulfilled") {
        setAllocation(allocationResponse.value.data);
      } else {
        const status = allocationResponse.reason?.response?.status;

        if (status === 404) {
          setAllocation(null);
        } else {
          console.log(
            "Allocation error:",
            allocationResponse.reason?.response?.data ||
              allocationResponse.reason?.message
          );
        }
      }
    } catch (error) {
      console.log(
        "Dashboard error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5A2B" />

        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <GlassBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Header handled by Navigation */}

        {/* Profile Card */}
        <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>
          👤 My Profile
        </Text>

        <Text style={styles.label}>
          Name
        </Text>

        <Text style={styles.value}>
          {profile?.fullName || "Not available"}
        </Text>

        <Text style={styles.label}>
          Email
        </Text>

        <Text style={styles.value}>
          {profile?.email || "Not available"}
        </Text>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.cardButtonText}>
            View Profile →
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Application Card */}
      <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>
          🏠 Hostel Application
        </Text>

        <Text style={styles.label}>
          Status
        </Text>

        <Text style={styles.status}>
          {application?.status || "No application"}
        </Text>

        {application?.hostel && (
          <>
            <Text style={styles.label}>
              Hostel
            </Text>

            <Text style={styles.value}>
              {application.hostel.name ||
                application.hostel.hostelName ||
                "Hostel"}
            </Text>
          </>
        )}

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() =>
            navigation.navigate(
              application ? "Application" : "AvailableHostels"
            )
          }
        >
          <Text style={styles.cardButtonText}>
            {application ? "View Application →" : "Apply for Hostel →"}
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Allocation Card */}
      <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>
          🛏 Room Allocation
        </Text>

        {allocation ? (
          <>
            <Text style={styles.label}>
              Room
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
          </>
        ) : (
          <Text style={styles.emptyText}>
            No room allocated yet.
          </Text>
        )}

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("RoomAllocation")}
        >
          <Text style={styles.cardButtonText}>
            View Room →
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Fee Details Card */}
      <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>
          💰 Fee Details
        </Text>

        <Text style={styles.value}>
          Manage your hostel fees and payments.
        </Text>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate("Fee")}
        >
          <Text style={styles.viewButtonText}>
            View Fee Details →
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Announcements Card */}
      <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>
          📢 Announcements
        </Text>

        <Text style={styles.value}>
          Stay updated with hostel news and important notices.
        </Text>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate("Announcements")}
        >
          <Text style={styles.viewButtonText}>
            View Announcements →
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Complaints Card */}
      <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>
          📝 Complaints
        </Text>

        <Text style={styles.value}>
          Report hostel issues and track their status.
        </Text>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate("Complaints")}
        >
          <Text style={styles.viewButtonText}>
            View Complaints →
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Leave Requests Card */}
      <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>
          🏖️ Leave Requests
        </Text>

        <Text style={styles.value}>
          Request and track your leave.
        </Text>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate("LeaveRequests")}
        >
          <Text style={styles.viewButtonText}>
            View Leave Requests →
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Visitor Requests Card */}
      <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>
          👥 Visitor Requests
        </Text>

        <Text style={styles.value}>
          Request and track visitors to your hostel.
        </Text>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate("VisitorRequests")}
        >
          <Text style={styles.viewButtonText}>
            View Visitor Requests →
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Room Transfer Card */}
      <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>
          🔄 Room Transfer
        </Text>

        <Text style={styles.value}>
          Request a transfer to another available room.
        </Text>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate("RoomTransfer")}
        >
          <Text style={styles.viewButtonText}>
            View Room Transfer →
          </Text>
        </TouchableOpacity>
      </BlurView>

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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  greeting: {
    fontSize: 15,
    color: "#666",
    marginBottom: 4,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#151515",
  },

  logoutButton: {
    backgroundColor: "#E53935",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },

  logoutText: {
    color: "#FFF",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.42)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginTop: 8,
    marginBottom: 3,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E4A28", // Deep Green Accent
  },

  status: {
    fontSize: 16,
    fontWeight: "800",
    color: "#8B5A2B",
  },

  emptyText: {
    fontSize: 15,
    color: "#777",
  },

  cardButton: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F5EDE6",
    alignItems: "center",
  },

  cardButtonText: {
    color: "#8B5A2B",
    fontWeight: "700",
    fontSize: 14,
  },

  viewButton: {
    backgroundColor: "#F5EDE6",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
  },

  viewButtonText: {
    color: "#8B5A2B",
    fontSize: 16,
    fontWeight: "700",
  },

});