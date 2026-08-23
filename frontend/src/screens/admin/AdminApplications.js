import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function AdminApplications({ navigation }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);

  const [processing, setProcessing] = useState(false);

  const [search, setSearch] = useState("");

  // -----------------------------------------
  // LOAD APPLICATIONS
  // -----------------------------------------

  const loadApplications = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/applications");

      setApplications(response.data || []);
    } catch (error) {
      console.log(
        "Applications error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // -----------------------------------------
  // OPEN APPROVAL MODAL
  // -----------------------------------------

  const openApproveModal = async (application) => {
    try {
      setSelectedApplication(application);
      setSelectedRoom(null);
      setRooms([]);
      setLoadingRooms(true);

      const hostelId = application.hostel?._id;

      if (!hostelId) {
        Alert.alert(
          "Error",
          "Unable to determine the requested hostel."
        );

        return;
      }

      const response = await apiClient.get(
        `/rooms/hostel/${hostelId}`
      );

      const availableRooms = (response.data || []).filter(
        (room) => room.isAvailable === true
      );

      setRooms(availableRooms);
    } catch (error) {
      console.log(
        "Rooms error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load available rooms."
      );

      setSelectedApplication(null);
    } finally {
      setLoadingRooms(false);
    }
  };

  // -----------------------------------------
  // APPROVE APPLICATION
  // -----------------------------------------

  const handleApprove = async () => {
    if (!selectedApplication) {
      return;
    }

    if (!selectedRoom) {
      Alert.alert(
        "Select Room",
        "Please select an available room before approving this application."
      );

      return;
    }

    try {
      setProcessing(true);

      await apiClient.put(
        `/applications/${selectedApplication._id}/approve`,
        {
          roomId: selectedRoom._id,
        }
      );

      Alert.alert(
        "Success",
        "Application approved and room allocated successfully."
      );

      setSelectedApplication(null);
      setSelectedRoom(null);
      setRooms([]);

      await loadApplications();
    } catch (error) {
      console.log(
        "Approve application error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Approval Failed",
        error.response?.data?.message ||
          "Unable to approve application."
      );
    } finally {
      setProcessing(false);
    }
  };

  // -----------------------------------------
  // REJECT APPLICATION
  // -----------------------------------------

  const handleReject = (application) => {
    Alert.alert(
      "Reject Application",
      `Are you sure you want to reject ${application.student?.fullName || "this student's"} application?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessing(true);

              await apiClient.put(
                `/applications/${application._id}/reject`
              );

              Alert.alert(
                "Rejected",
                "Application rejected successfully."
              );

              await loadApplications();
            } catch (error) {
              console.log(
                "Reject application error:",
                error.response?.data || error.message
              );

              Alert.alert(
                "Rejection Failed",
                error.response?.data?.message ||
                  "Unable to reject application."
              );
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  // -----------------------------------------
  // SEARCH
  // -----------------------------------------

  const filteredApplications = applications.filter(
    (application) => {
      const studentName =
        application.student?.fullName?.toLowerCase() || "";

      const email =
        application.student?.email?.toLowerCase() || "";

      const hostelName =
        application.hostel?.name?.toLowerCase() || "";

      const searchValue = search.toLowerCase();

      return (
        studentName.includes(searchValue) ||
        email.includes(searchValue) ||
        hostelName.includes(searchValue)
      );
    }
  );

  // -----------------------------------------
  // STATUS COLOR
  // -----------------------------------------

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return {
          backgroundColor: "#E8F5E9",
          color: "#2E7D32",
        };

      case "Rejected":
        return {
          backgroundColor: "#FFEBEE",
          color: "#C62828",
        };

      default:
        return {
          backgroundColor: "#FFF3E0",
          color: "#EF6C00",
        };
    }
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#8B5A2B"
          />

          <Text style={styles.loadingText}>
            Loading applications...
          </Text>
        </View>
      </GlassBackground>
    );
  }

  // -----------------------------------------
  // SCREEN
  // -----------------------------------------

  return (
    <GlassBackground>
      <View style={styles.container}>

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

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            Applications
          </Text>

          <Text style={styles.subtitle}>
            Manage hostel applications
          </Text>
        </View>

        <View style={{ width: 42 }} />
      </View>

      {/* Search */}

      <TextInput
        style={styles.searchInput}
        placeholder="Search students or hostels..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      {/* Applications */}

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        {filteredApplications.length === 0 ? (
          <View style={styles.emptyCard}>

            <Text style={styles.emptyIcon}>
              📄
            </Text>

            <Text style={styles.emptyTitle}>
              No Applications Found
            </Text>

            <Text style={styles.emptyText}>
              {search
                ? "No applications match your search."
                : "There are currently no hostel applications."}
            </Text>

          </View>
        ) : (
          filteredApplications.map((application) => {
            const statusStyle = getStatusStyle(
              application.status
            );

            return (
              <View
                key={application._id}
                style={styles.applicationCard}
              >

                {/* Top */}

                <View style={styles.cardTop}>

                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {application.student?.fullName
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </Text>
                  </View>

                  <View style={styles.studentInfo}>

                    <Text style={styles.studentName}>
                      {application.student?.fullName ||
                        "Unknown Student"}
                    </Text>

                    <Text style={styles.email}>
                      {application.student?.email ||
                        "No email"}
                    </Text>

                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          statusStyle.backgroundColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: statusStyle.color,
                        },
                      ]}
                    >
                      {application.status}
                    </Text>
                  </View>

                </View>

                {/* Hostel */}

                <View style={styles.infoSection}>

                  <Text style={styles.infoLabel}>
                    Requested Hostel
                  </Text>

                  <Text style={styles.infoValue}>
                    🏢{" "}
                    {application.hostel?.name ||
                      "Unknown Hostel"}
                  </Text>

                </View>

                {/* Date */}

                <View style={styles.infoSection}>

                  <Text style={styles.infoLabel}>
                    Applied On
                  </Text>

                  <Text style={styles.infoValue}>
                    {application.createdAt
                      ? new Date(
                          application.createdAt
                        ).toLocaleDateString()
                      : "Unknown"}
                  </Text>

                </View>

                {/* Remarks */}

                {application.remarks ? (
                  <View style={styles.remarksBox}>

                    <Text style={styles.infoLabel}>
                      Remarks
                    </Text>

                    <Text style={styles.remarksText}>
                      {application.remarks}
                    </Text>

                  </View>
                ) : null}

                {/* Actions */}

                {application.status === "Pending" && (
                  <View style={styles.actions}>

                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() =>
                        openApproveModal(application)
                      }
                    >
                      <Text style={styles.approveText}>
                        ✓ Approve
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() =>
                        handleReject(application)
                      }
                    >
                      <Text style={styles.rejectText}>
                        ✕ Reject
                      </Text>
                    </TouchableOpacity>

                  </View>
                )}

              </View>
            );
          })
        )}

      </ScrollView>

      {/* APPROVAL MODAL */}

      <Modal
        visible={!!selectedApplication}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!processing) {
            setSelectedApplication(null);
            setSelectedRoom(null);
          }
        }}
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <View style={styles.modalHeader}>

              <View>
                <Text style={styles.modalTitle}>
                  Allocate Room
                </Text>

                <Text style={styles.modalSubtitle}>
                  {selectedApplication?.student
                    ?.fullName || "Student"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (!processing) {
                    setSelectedApplication(null);
                    setSelectedRoom(null);
                  }
                }}
              >
                <Text style={styles.closeText}>
                  ✕
                </Text>
              </TouchableOpacity>

            </View>

            <Text style={styles.hostelText}>
              Hostel:{" "}
              {selectedApplication?.hostel?.name ||
                "Unknown"}
            </Text>

            {loadingRooms ? (
              <View style={styles.modalLoading}>

                <ActivityIndicator
                  size="large"
                  color="#8B5A2B"
                />

                <Text style={styles.loadingText}>
                  Loading available rooms...
                </Text>

              </View>
            ) : rooms.length === 0 ? (
              <View style={styles.noRoomsBox}>

                <Text style={styles.noRoomsIcon}>
                  🛏️
                </Text>

                <Text style={styles.noRoomsTitle}>
                  No Available Rooms
                </Text>

                <Text style={styles.noRoomsText}>
                  There are currently no available
                  rooms in this hostel.
                </Text>

              </View>
            ) : (
              <ScrollView
                style={styles.roomList}
                nestedScrollEnabled
              >

                {rooms.map((room) => {
                  const selected =
                    selectedRoom?._id === room._id;

                  return (
                    <TouchableOpacity
                      key={room._id}
                      style={[
                        styles.roomCard,
                        selected &&
                          styles.selectedRoom,
                      ]}
                      onPress={() =>
                        setSelectedRoom(room)
                      }
                    >

                      <View>
                        <Text style={styles.roomNumber}>
                          Room {room.roomNumber}
                        </Text>

                        <Text style={styles.roomDetails}>
                          {room.roomType} • Capacity{" "}
                          {room.capacity}
                        </Text>

                        <Text style={styles.roomOccupancy}>
                          Occupied: {room.occupied} /{" "}
                          {room.capacity}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.radio,
                          selected &&
                            styles.radioSelected,
                        ]}
                      >
                        {selected && (
                          <View
                            style={styles.radioInner}
                          />
                        )}
                      </View>

                    </TouchableOpacity>
                  );
                })}

              </ScrollView>
            )}

            {/* Modal Action */}

            {rooms.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (!selectedRoom || processing) &&
                    styles.disabledButton,
                ]}
                onPress={handleApprove}
                disabled={!selectedRoom || processing}
              >
                {processing ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    Approve & Allocate Room
                  </Text>
                )}
              </TouchableOpacity>
            )}

          </View>

        </View>

      </Modal>

      </View>
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
    paddingTop: 5,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: "transparent",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#F5EDE6",
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    fontSize: 25,
    color: "#8B5A2B",
    fontWeight: "700",
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#222",
  },

  subtitle: {
    marginTop: 3,
    color: "#777",
    fontSize: 14,
  },

  searchInput: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E4EC",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#222",
  },

  applicationCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8B5A2B",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
  },

  studentInfo: {
    flex: 1,
    marginLeft: 12,
  },

  studentName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
  },

  email: {
    marginTop: 3,
    fontSize: 13,
    color: "#777",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },

  infoSection: {
    marginBottom: 12,
  },

  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  remarksBox: {
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 12,
    marginTop: 3,
    marginBottom: 12,
  },

  remarksText: {
    color: "#555",
    fontSize: 14,
    lineHeight: 20,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },

  approveButton: {
    flex: 1,
    backgroundColor: "#8B5A2B",
    paddingVertical: 13,
    borderRadius: 11,
    alignItems: "center",
  },

  approveText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
  },

  rejectButton: {
    flex: 1,
    backgroundColor: "#FFEBEE",
    paddingVertical: 13,
    borderRadius: 11,
    alignItems: "center",
  },

  rejectText: {
    color: "#C62828",
    fontSize: 14,
    fontWeight: "800",
  },

  emptyCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    marginTop: 20,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
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

  // -----------------------------------------
  // MODAL
  // -----------------------------------------

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 22,
    maxHeight: "85%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
  },

  modalSubtitle: {
    marginTop: 3,
    color: "#777",
    fontSize: 14,
  },

  closeText: {
    fontSize: 20,
    color: "#777",
    fontWeight: "700",
  },

  hostelText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },

  modalLoading: {
    paddingVertical: 40,
    alignItems: "center",
  },

  roomList: {
    maxHeight: 350,
  },

  roomCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E4EC",
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },

  selectedRoom: {
    borderColor: "#8B5A2B",
    backgroundColor: "#F5EDE6",
  },

  roomNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
  },

  roomDetails: {
    marginTop: 4,
    color: "#666",
    fontSize: 13,
  },

  roomOccupancy: {
    marginTop: 3,
    color: "#888",
    fontSize: 12,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#B8C0D0",
    justifyContent: "center",
    alignItems: "center",
  },

  radioSelected: {
    borderColor: "#8B5A2B",
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#8B5A2B",
  },

  noRoomsBox: {
    alignItems: "center",
    paddingVertical: 35,
  },

  noRoomsIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  noRoomsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },

  noRoomsText: {
    marginTop: 6,
    textAlign: "center",
    color: "#777",
    lineHeight: 20,
  },

  confirmButton: {
    backgroundColor: "#8B5A2B",
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 15,
  },

  disabledButton: {
    opacity: 0.6,
  },

  confirmButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },
});