import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";

import GlassBackground from "../../components/GlassBackground";

export default function AdminDashboard({ navigation }) {
  return (
    <GlassBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Students */}
        <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>👨‍🎓 Students</Text>

        <Text style={styles.cardDescription}>
          View and manage registered hostel students.
        </Text>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("AdminStudents")}
        >
          <Text style={styles.cardButtonText}>
            Manage Students →
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Hostels */}
      <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>🏨 Hostels</Text>

        <Text style={styles.cardDescription}>
          Manage hostels and their available rooms.
        </Text>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("AdminHostels")}
        >
          <Text style={styles.cardButtonText}>
            Manage Hostels →
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Rooms */}
      <BlurView intensity={45} tint="light" style={styles.card}>
        <Text style={styles.cardTitle}>🛏 Rooms</Text>

        <Text style={styles.cardDescription}>
          Manage rooms, capacity and occupancy.
        </Text>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("AdminRooms")}
        >
          <Text style={styles.cardButtonText}>
            Manage Rooms →
          </Text>
        </TouchableOpacity>
      </BlurView>

      {/* Applications */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Applications</Text>

        <Text style={styles.cardDescription}>
          Review and manage hostel applications.
        </Text>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("AdminApplications")}
        >
          <Text style={styles.cardButtonText}>
            View Applications →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Complaints */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📝 Complaints</Text>

        <Text style={styles.cardDescription}>
          Review student complaints and update their status.
        </Text>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("AdminComplaints")}
        >
          <Text style={styles.cardButtonText}>
            Manage Complaints →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Fees */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💰 Fee Management</Text>

        <Text style={styles.cardDescription}>
          Manage hostel fees and student payments.
        </Text>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("AdminFees")}
        >
          <Text style={styles.cardButtonText}>
            Manage Fees →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Announcements */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📢 Announcements</Text>

        <Text style={styles.cardDescription}>
          Create and manage hostel announcements.
        </Text>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("AdminAnnouncements")}
        >
          <Text style={styles.cardButtonText}>
            Manage Announcements →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reports */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Reports</Text>

        <Text style={styles.cardDescription}>
          View hostel occupancy and management reports.
        </Text>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("AdminReports")}
        >
          <Text style={styles.cardButtonText}>
            View Reports →
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
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
    fontSize: 20,
    fontWeight: "800",
    color: "#222",
    marginBottom: 12,
  },

  cardDescription: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 18,
  },

  cardButton: {
    backgroundColor: "#F5EDE6",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  cardButtonText: {
    color: "#8B5A2B",
    fontSize: 16,
    fontWeight: "700",
  },
});