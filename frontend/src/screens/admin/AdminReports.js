import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function AdminReports({ navigation }) {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [occupancy, setOccupancy] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);

      const [
        dashboardResponse,
        revenueResponse,
        occupancyResponse,
      ] = await Promise.all([
        apiClient.get("/reports/dashboard"),
        apiClient.get("/reports/revenue"),
        apiClient.get("/reports/occupancy"),
      ]);

      setStats(dashboardResponse.data);
      setRevenue(revenueResponse.data || []);
      setOccupancy(occupancyResponse.data || []);
    } catch (error) {
      console.log(
        "Reports error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#8B5A2B"
          />

          <Text style={styles.loadingText}>
            Loading reports...
          </Text>
        </View>
      </GlassBackground>
    );
  }

  if (!stats) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            Unable to load report data.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadReports}
          >
            <Text style={styles.retryButtonText}>
              Retry
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

        <View>
          <Text style={styles.title}>
            Reports
          </Text>

          <Text style={styles.subtitle}>
            Hostel management overview
          </Text>
        </View>
      </View>

      {/* Overview */}

      <Text style={styles.sectionTitle}>
        Overview
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.students}
          </Text>

          <Text style={styles.statLabel}>
            Students
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.hostels}
          </Text>

          <Text style={styles.statLabel}>
            Hostels
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.rooms}
          </Text>

          <Text style={styles.statLabel}>
            Rooms
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.totalRevenue}
          </Text>

          <Text style={styles.statLabel}>
            Total Revenue
          </Text>
        </View>
      </View>

      {/* Applications */}

      <Text style={styles.sectionTitle}>
        Applications
      </Text>

      <View style={styles.reportCard}>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>
            Pending Applications
          </Text>

          <Text style={styles.reportValue}>
            {stats.pendingApplications}
          </Text>
        </View>

        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>
            Approved Applications
          </Text>

          <Text style={styles.reportValue}>
            {stats.approvedApplications}
          </Text>
        </View>
      </View>

      {/* Complaints */}

      <Text style={styles.sectionTitle}>
        Complaints
      </Text>

      <View style={styles.reportCard}>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>
            Pending
          </Text>

          <Text style={styles.reportValue}>
            {stats.pendingComplaints}
          </Text>
        </View>

        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>
            Resolved
          </Text>

          <Text style={styles.reportValue}>
            {stats.resolvedComplaints}
          </Text>
        </View>
      </View>

      {/* Occupancy */}

      <Text style={styles.sectionTitle}>
        Hostel Occupancy
      </Text>

      {occupancy.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No occupancy data available.
          </Text>
        </View>
      ) : (
        occupancy.map((item, index) => (
          <View
            key={index}
            style={styles.occupancyCard}
          >
            <View style={styles.occupancyHeader}>
              <Text style={styles.hostelName}>
                {item.hostelName}
              </Text>

              <Text style={styles.percentage}>
                {Math.round(item.occupancyRate)}%
              </Text>
            </View>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      item.occupancyRate,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.occupancyText}>
              {item.currentOccupancy} occupied /{" "}
              {item.totalCapacity} capacity
            </Text>
          </View>
        ))
      )}

      {/* Revenue */}

      <Text style={styles.sectionTitle}>
        Revenue
      </Text>

      {revenue.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No revenue data available.
          </Text>
        </View>
      ) : (
        revenue.map((item, index) => (
          <View
            key={index}
            style={styles.reportCard}
          >
            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>
                {item._id.month}/{item._id.year}
              </Text>

              <Text style={styles.reportValue}>
                {item.total}
              </Text>
            </View>
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
    color: "#666",
  },

  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  backButtonText: {
    fontSize: 24,
    color: "#222",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#222",
  },

  subtitle: {
    marginTop: 4,
    color: "#777",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#222",
    marginBottom: 12,
    marginTop: 10,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },

  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#8B5A2B",
  },

  statLabel: {
    marginTop: 6,
    color: "#777",
    fontSize: 14,
  },

  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },

  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  reportLabel: {
    color: "#555",
    fontSize: 15,
  },

  reportValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#8B5A2B",
  },

  occupancyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },

  occupancyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  hostelName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  percentage: {
    fontSize: 16,
    fontWeight: "800",
    color: "#8B5A2B",
  },

  progressBackground: {
    height: 8,
    backgroundColor: "#E7EAF0",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 14,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#8B5A2B",
    borderRadius: 8,
  },

  occupancyText: {
    marginTop: 8,
    color: "#777",
    fontSize: 13,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 18,
    alignItems: "center",
  },

  emptyText: {
    color: "#777",
  },

  retryButton: {
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});