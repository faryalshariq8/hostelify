import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function LeaveRequests({ navigation }) {
  const [leaves, setLeaves] = useState([]);
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadLeaves = async () => {
    try {
      const response = await apiClient.get("/leaves/my");
      setLeaves(response.data);
    } catch (error) {
      console.log(
        "Leave loading error:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load leave requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const submitLeave = async () => {
    if (!reason || !startDate || !endDate) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);

      await apiClient.post("/leaves", {
        reason,
        startDate,
        endDate,
      });

      Alert.alert("Success", "Leave request submitted successfully.");

      setReason("");
      setStartDate("");
      setEndDate("");

      await loadLeaves();
    } catch (error) {
      console.log(
        "Leave submission error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to submit leave request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5A2B" />
          <Text style={styles.loadingText}>
            Loading leave requests...
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Leave Requests</Text>
      </View>

      {/* New Request */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Request Leave
        </Text>

        <Text style={styles.label}>Reason</Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter reason for leave"
          placeholderTextColor="#888"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        <Text style={styles.label}>Start Date</Text>

        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
          value={startDate}
          onChangeText={setStartDate}
        />

        <Text style={styles.label}>End Date</Text>

        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
          value={endDate}
          onChangeText={setEndDate}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={submitLeave}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
              Submit Leave Request
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Previous Requests */}
      <Text style={styles.sectionTitle}>
        My Leave Requests
      </Text>

      {leaves.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No leave requests yet.
          </Text>
        </View>
      ) : (
        leaves.map((leave) => (
          <View style={styles.card} key={leave._id}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>
                Leave Request
              </Text>

              <Text
                style={[
                  styles.status,
                  leave.status === "Approved" &&
                    styles.approved,
                  leave.status === "Rejected" &&
                    styles.rejected,
                ]}
              >
                {leave.status}
              </Text>
            </View>

            <Text style={styles.label}>Reason</Text>
            <Text style={styles.value}>
              {leave.reason}
            </Text>

            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>
              {new Date(leave.startDate).toLocaleDateString()}
            </Text>

            <Text style={styles.label}>To</Text>
            <Text style={styles.value}>
              {new Date(leave.endDate).toLocaleDateString()}
            </Text>
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
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  header: {
    marginBottom: 20,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  backText: {
    fontSize: 17,
    color: "#8B5A2B",
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#777",
    marginTop: 8,
    marginBottom: 5,
  },

  value: {
    fontSize: 16,
    color: "#222",
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#FAFAFA",
  },

  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#8B5A2B",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    backgroundColor: "#FFF3CD",
    color: "#856404",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontWeight: "700",
  },

  approved: {
    backgroundColor: "#D4EDDA",
    color: "#155724",
  },

  rejected: {
    backgroundColor: "#F8D7DA",
    color: "#721C24",
  },

  emptyCard: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },

  emptyText: {
    color: "#777",
    fontSize: 15,
  },
});