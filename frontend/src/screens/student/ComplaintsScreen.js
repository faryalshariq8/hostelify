import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";


export default function ComplaintsScreen({ navigation }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


  const loadComplaints = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/complaints/my");

      setComplaints(response.data);
    } catch (error) {
      console.log(
        "Complaints error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Complaints Error",
        error.response?.data?.message ||
          "Unable to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadComplaints();
  }, []);


  const submitComplaint = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter both a title and description."
      );
      return;
    }

    try {
      setSubmitting(true);

      await apiClient.post("/complaints", {
        title: title.trim(),
        description: description.trim(),
      });

      Alert.alert(
        "Complaint Submitted",
        "Your complaint has been submitted successfully."
      );

      setTitle("");
      setDescription("");

      await loadComplaints();
    } catch (error) {
      console.log(
        "Submit complaint error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Submission Failed",
        error.response?.data?.message ||
          "Unable to submit complaint."
      );
    } finally {
      setSubmitting(false);
    }
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return styles.resolvedBadge;

      case "In Progress":
        return styles.progressBadge;

      default:
        return styles.pendingBadge;
    }
  };


  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5A2B" />

          <Text style={styles.loadingText}>
            Loading complaints...
          </Text>
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
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>
            📝 Complaints
          </Text>

          <Text style={styles.headerSubtitle}>
            Report an issue or track your complaints
          </Text>
        </View>

      </View>


      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Submit Complaint */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Submit a Complaint
          </Text>

          <Text style={styles.label}>
            Title
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Wi-Fi not working"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>
            Description
          </Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your issue..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.disabledButton,
            ]}
            onPress={submitComplaint}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                Submit Complaint
              </Text>
            )}
          </TouchableOpacity>

        </View>


        {/* Previous Complaints */}
        <Text style={styles.sectionTitle}>
          My Complaints
        </Text>

        {complaints.length === 0 ? (
          <View style={styles.emptyCard}>

            <Text style={styles.emptyIcon}>
              📭
            </Text>

            <Text style={styles.emptyTitle}>
              No Complaints
            </Text>

            <Text style={styles.emptyText}>
              You haven't submitted any complaints yet.
            </Text>

          </View>
        ) : (
          complaints.map((complaint) => (
            <View
              key={complaint._id}
              style={styles.complaintCard}
            >

              <View style={styles.complaintHeader}>

                <View style={styles.complaintTitleContainer}>
                  <Text style={styles.complaintTitle}>
                    {complaint.title}
                  </Text>

                  <Text style={styles.date}>
                    {new Date(
                      complaint.createdAt
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>

                <View style={getStatusStyle(complaint.status)}>
                  <Text style={styles.statusText}>
                    {complaint.status || "Pending"}
                  </Text>
                </View>

              </View>

              <Text style={styles.description}>
                {complaint.description}
              </Text>

            </View>
          ))
        )}

      </ScrollView>

      </View>
    </GlassBackground>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "transparent",
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
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#8B5A2B",
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  backText: {
    color: "#FFF",
    fontSize: 30,
    lineHeight: 32,
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#DCE6FF",
    fontSize: 13,
    marginTop: 4,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 20,
    color: "#202020",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D9DDE7",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#FAFBFD",
    marginBottom: 16,
  },

  textArea: {
    minHeight: 110,
  },

  submitButton: {
    backgroundColor: "#8B5A2B",
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#202020",
    marginBottom: 14,
  },

  complaintCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
  },

  complaintHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  complaintTitleContainer: {
    flex: 1,
    marginRight: 10,
  },

  complaintTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
  },

  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },

  pendingBadge: {
    backgroundColor: "#FFF4D6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  progressBadge: {
    backgroundColor: "#E5F0FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  resolvedBadge: {
    backgroundColor: "#DDF7E8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#444",
  },

  emptyCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
  },

});