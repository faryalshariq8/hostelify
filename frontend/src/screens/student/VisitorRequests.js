import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function VisitorRequests({ navigation }) {
  const [visitors, setVisitors] = useState([]);

  const [visitorName, setVisitorName] = useState("");
  const [relation, setRelation] = useState("");
  const [visitDate, setVisitDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadVisitors = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/visitors/my");

      setVisitors(response.data);
    } catch (error) {
      console.log(
        "Visitor requests error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load visitor requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const submitVisitor = async () => {
    if (!visitorName.trim() || !relation.trim() || !visitDate.trim()) {
      Alert.alert(
        "Missing Information",
        "Please fill in visitor name, relation and visit date."
      );
      return;
    }

    try {
      setSubmitting(true);

      await apiClient.post("/visitors", {
        visitorName: visitorName.trim(),
        relation: relation.trim(),
        visitDate: visitDate.trim(),
      });

      Alert.alert(
        "Request Submitted",
        "Your visitor request has been submitted."
      );

      setVisitorName("");
      setRelation("");
      setVisitDate("");

      loadVisitors();
    } catch (error) {
      console.log(
        "Submit visitor error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Submission Failed",
        error.response?.data?.message ||
          "Unable to submit visitor request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Approved") {
      return styles.approved;
    }

    if (status === "Rejected") {
      return styles.rejected;
    }

    return styles.pending;
  };

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
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          👥 Visitor Requests
        </Text>

        <Text style={styles.subtitle}>
          Request and track visitors to your hostel.
        </Text>
      </View>

      {/* Request Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          👤 New Visitor Request
        </Text>

        <Text style={styles.label}>
          Visitor Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter visitor name"
          placeholderTextColor="#888"
          value={visitorName}
          onChangeText={setVisitorName}
        />

        <Text style={styles.label}>
          Relation
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Father, Mother, Brother"
          placeholderTextColor="#888"
          value={relation}
          onChangeText={setRelation}
        />

        <Text style={styles.label}>
          Visit Date
        </Text>

        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
          value={visitDate}
          onChangeText={setVisitDate}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitVisitor}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              👥 Submit Visitor Request
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Previous Requests */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📋 My Visitor Requests
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#8B5A2B"
          />
        ) : visitors.length === 0 ? (
          <Text style={styles.emptyText}>
            No visitor requests yet.
          </Text>
        ) : (
          visitors.map((visitor) => (
            <View
              key={visitor._id}
              style={styles.requestCard}
            >
              <Text style={styles.visitorName}>
                {visitor.visitorName}
              </Text>

              <Text style={styles.detail}>
                Relation: {visitor.relation}
              </Text>

              <Text style={styles.detail}>
                Visit Date:{" "}
                {visitor.visitDate
                  ? new Date(visitor.visitDate).toLocaleDateString()
                  : "Not available"}
              </Text>

              <Text
                style={[
                  styles.status,
                  getStatusStyle(visitor.status),
                ]}
              >
                {visitor.status || "Pending"}
              </Text>
            </View>
          ))
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
    paddingBottom: 40,
  },

  header: {
    marginBottom: 20,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 15,
  },

  backText: {
    color: "#8B5A2B",
    fontSize: 17,
    fontWeight: "700",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#222",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 17,
    color: "#555",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  cardTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#222",
    marginBottom: 22,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D5D9E2",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#FAFBFF",
    marginBottom: 18,
  },

  submitButton: {
    backgroundColor: "#8B5A2B",
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 5,
  },

  submitButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },

  requestCard: {
    backgroundColor: "#F5F7FF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 14,
  },

  visitorName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
    marginBottom: 8,
  },

  detail: {
    fontSize: 15,
    color: "#555",
    marginBottom: 5,
  },

  status: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: "700",
  },

  pending: {
    color: "#D97706",
    backgroundColor: "#FEF3C7",
  },

  approved: {
    color: "#15803D",
    backgroundColor: "#DCFCE7",
  },

  rejected: {
    color: "#DC2626",
    backgroundColor: "#FEE2E2",
  },

  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});