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

export default function AdminComplaints({ navigation }) {
  const [complaints, setComplaints] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadComplaints = async (
    selectedPage = page,
    searchValue = search,
    statusValue = status
  ) => {
    try {
      setLoading(true);

      const response = await apiClient.get("/complaints", {
        params: {
          search: searchValue,
          status: statusValue,
          page: selectedPage,
          limit: 10,
          sort: "-createdAt",
        },
      });

      setComplaints(response.data.complaints || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(
        "Complaints error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints(1, "", "");
  }, []);

  const handleSearch = () => {
    setPage(1);
    loadComplaints(1, search, status);
  };

  const handleStatusFilter = (newStatus) => {
    setStatus(newStatus);
    setPage(1);

    loadComplaints(1, search, newStatus);
  };

  const updateStatus = async (complaintId, newStatus) => {
   try {
    setUpdatingId(complaintId);

    await apiClient.put(`/complaints/${complaintId}`, {
      status: newStatus,
    });

    // Update the complaint locally
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint._id === complaintId
          ? {
              ...complaint,
              status: newStatus,
            }
          : complaint
      )
    );

  } catch (error) {
    console.log(
      "Update complaint error:",
      error.response?.data || error.message
    );

    // Don't show an Alert here.
    // The console error is enough while we're fixing
    // the Android Activity warning.
  } finally {
    setUpdatingId(null);
  }
 };

    const confirmStatusChange = (complaint, newStatus) => {
    if (complaint.status === newStatus) {
        return;
    }

    updateStatus(complaint._id, newStatus);
    };

  const goToPreviousPage = () => {
    if (page <= 1) return;

    const newPage = page - 1;
    setPage(newPage);

    loadComplaints(newPage, search, status);
  };

  const goToNextPage = () => {
    if (page >= totalPages) return;

    const newPage = page + 1;
    setPage(newPage);

    loadComplaints(newPage, search, status);
  };

  const getStatusStyle = (complaintStatus) => {
    if (complaintStatus === "Resolved") {
      return styles.resolvedBadge;
    }

    if (complaintStatus === "In Progress") {
      return styles.progressBadge;
    }

    return styles.pendingBadge;
  };

  if (loading && complaints.length === 0) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#8B5A2B"
          />

          <Text style={styles.loadingText}>
            Loading complaints...
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
      keyboardShouldPersistTaps="handled"
    >
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>Complaints</Text>

          <Text style={styles.subtitle}>
            Manage student complaints
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search complaints..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* STATUS FILTERS */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            status === "" && styles.activeFilter,
          ]}
          onPress={() => handleStatusFilter("")}
        >
          <Text
            style={[
              styles.filterText,
              status === "" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            status === "Pending" && styles.activeFilter,
          ]}
          onPress={() =>
            handleStatusFilter("Pending")
          }
        >
          <Text
            style={[
              styles.filterText,
              status === "Pending" &&
                styles.activeFilterText,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            status === "In Progress" &&
              styles.activeFilter,
          ]}
          onPress={() =>
            handleStatusFilter("In Progress")
          }
        >
          <Text
            style={[
              styles.filterText,
              status === "In Progress" &&
                styles.activeFilterText,
            ]}
          >
            In Progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            status === "Resolved" &&
              styles.activeFilter,
          ]}
          onPress={() =>
            handleStatusFilter("Resolved")
          }
        >
          <Text
            style={[
              styles.filterText,
              status === "Resolved" &&
                styles.activeFilterText,
            ]}
          >
            Resolved
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* EMPTY */}

      {complaints.length === 0 && !loading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🛠</Text>

          <Text style={styles.emptyTitle}>
            No Complaints Found
          </Text>

          <Text style={styles.emptyText}>
            {search || status
              ? "No complaints match the selected filters."
              : "There are no student complaints yet."}
          </Text>
        </View>
      ) : (
        complaints.map((complaint) => (
          <View
            key={complaint._id}
            style={styles.complaintCard}
          >
            <View style={styles.cardHeader}>
              <View style={styles.complaintIcon}>
                <Text>🛠</Text>
              </View>

              <View style={styles.cardHeaderText}>
                <Text style={styles.complaintTitle}>
                  {complaint.title}
                </Text>

                <Text style={styles.studentName}>
                  {complaint.student?.fullName ||
                    "Unknown Student"}
                </Text>

                <Text style={styles.studentEmail}>
                  {complaint.student?.email || ""}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  getStatusStyle(complaint.status),
                ]}
              >
                <Text style={styles.statusText}>
                  {complaint.status}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>
              {complaint.description}
            </Text>

            {/* STATUS ACTIONS */}

            <Text style={styles.actionLabel}>
              Update Status
            </Text>

            <View style={styles.statusActions}>
              {[
                "Pending",
                "In Progress",
                "Resolved",
              ].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.statusButton,
                    complaint.status === option &&
                      styles.selectedStatusButton,
                  ]}
                  disabled={updatingId === complaint._id}
                  onPress={() =>
                    confirmStatusChange(
                      complaint,
                      option
                    )
                  }
                >
                  {updatingId === complaint._id ? (
                    <ActivityIndicator
                        size="small"
                        color="#FFF"
                    />
                    ) : (
                    <Text
                        style={[
                        styles.statusButtonText,
                        complaint.status === option &&
                            styles.selectedStatusButtonText,
                        ]}
                    >
                        {option}
                    </Text>
                    )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}

      {/* PAGINATION */}

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              page === 1 &&
                styles.disabledPageButton,
            ]}
            onPress={goToPreviousPage}
            disabled={page === 1}
          >
            <Text style={styles.pageButtonText}>
              ← Previous
            </Text>
          </TouchableOpacity>

          <Text style={styles.pageText}>
            {page} / {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageButton,
              page === totalPages &&
                styles.disabledPageButton,
            ]}
            onPress={goToNextPage}
            disabled={page === totalPages}
          >
            <Text style={styles.pageButtonText}>
              Next →
            </Text>
          </TouchableOpacity>
        </View>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#FFF",
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
    fontSize: 14,
  },

  searchContainer: {
    flexDirection: "row",
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 15,
    color: "#222",
  },

  searchButton: {
    marginLeft: 8,
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 18,
    borderRadius: 16,
    justifyContent: "center",
  },

  searchButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  filterScroll: {
    marginBottom: 18,
  },

  filterButton: {
    backgroundColor: "#FFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },

  activeFilter: {
    backgroundColor: "#8B5A2B",
  },

  filterText: {
    color: "#555",
    fontWeight: "600",
  },

  activeFilterText: {
    color: "#FFF",
  },

  complaintCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 17,
    marginBottom: 15,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  complaintIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#F5EDE6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  cardHeaderText: {
    flex: 1,
  },

  complaintTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
  },

  studentName: {
    marginTop: 4,
    fontWeight: "600",
    color: "#555",
  },

  studentEmail: {
    marginTop: 2,
    fontSize: 12,
    color: "#888",
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: 8,
  },

  pendingBadge: {
    backgroundColor: "#FFF3CD",
  },

  progressBadge: {
    backgroundColor: "#DCEBFF",
  },

  resolvedBadge: {
    backgroundColor: "#DDF5E5",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#444",
  },

  description: {
    marginTop: 15,
    color: "#555",
    lineHeight: 21,
  },

  actionLabel: {
    marginTop: 18,
    marginBottom: 8,
    fontWeight: "700",
    color: "#333",
  },

  statusActions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  statusButton: {
    borderWidth: 1,
    borderColor: "#D5D9E2",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    marginRight: 7,
    marginBottom: 5,
  },

  selectedStatusButton: {
    backgroundColor: "#8B5A2B",
    borderColor: "#8B5A2B",
  },

  statusButtonText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 12,
  },

  selectedStatusButtonText: {
    color: "#FFF",
  },

  emptyCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 35,
    alignItems: "center",
    marginTop: 10,
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
  },

  emptyText: {
    marginTop: 7,
    textAlign: "center",
    color: "#777",
    lineHeight: 20,
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  pageButton: {
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 10,
  },

  disabledPageButton: {
    backgroundColor: "#D7D9DE",
  },

  pageButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  pageText: {
    fontWeight: "700",
    color: "#555",
  },
});