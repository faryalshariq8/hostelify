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

export default function RoomTransfer({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [roomsResponse, requestsResponse] = await Promise.all([
        apiClient.get("/rooms"),
        apiClient.get("/room-transfers/my"),
      ]);

      setRooms(
        Array.isArray(roomsResponse.data)
          ? roomsResponse.data
          : roomsResponse.data.rooms || []
      );

      setRequests(requestsResponse.data);
    } catch (error) {
      console.log(
        "Room transfer error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load room transfer information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitRequest = async () => {
    if (!selectedRoom) {
      Alert.alert(
        "Select Room",
        "Please select a room you want to transfer to."
      );
      return;
    }

    if (!reason.trim()) {
      Alert.alert(
        "Reason Required",
        "Please provide a reason for the room transfer."
      );
      return;
    }

    try {
      setSubmitting(true);

      await apiClient.post("/room-transfers", {
        newRoom: selectedRoom._id,
        reason: reason.trim(),
      });

      Alert.alert(
        "Request Submitted",
        "Your room transfer request has been submitted."
      );

      setSelectedRoom(null);
      setReason("");

      loadData();
    } catch (error) {
      console.log(
        "Room transfer submission error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Request Failed",
        error.response?.data?.message ||
          "Unable to submit room transfer request."
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
          <Text style={styles.backText}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          🔄 Room Transfer
        </Text>

        <Text style={styles.subtitle}>
          Request a transfer to another available room.
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#8B5A2B"
          />

          <Text style={styles.loadingText}>
            Loading rooms...
          </Text>
        </View>
      ) : (
        <>
          {/* Available Rooms */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              🛏️ Available Rooms
            </Text>

            {rooms.length === 0 ? (
              <Text style={styles.emptyText}>
                No rooms available.
              </Text>
            ) : (
              rooms
                .filter((room) => room.isAvailable)
                .map((room) => {
                  const selected =
                    selectedRoom?._id === room._id;

                  return (
                    <TouchableOpacity
                      key={room._id}
                      style={[
                        styles.roomOption,
                        selected && styles.selectedRoom,
                      ]}
                      onPress={() => setSelectedRoom(room)}
                    >
                      <View>
                        <Text style={styles.roomNumber}>
                          Room {room.roomNumber}
                        </Text>

                        <Text style={styles.roomDetails}>
                          {room.roomType} •{" "}
                          {room.occupied}/{room.capacity} occupied
                        </Text>
                      </View>

                      {selected && (
                        <Text style={styles.selectedText}>
                          ✓
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })
            )}
          </View>

          {/* Reason */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              📝 Transfer Reason
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Why would you like to transfer rooms?"
              placeholderTextColor="#888"
              multiline
              numberOfLines={5}
              value={reason}
              onChangeText={setReason}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitRequest}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  🔄 Submit Transfer Request
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Previous Requests */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              📋 My Transfer Requests
            </Text>

            {requests.length === 0 ? (
              <Text style={styles.emptyText}>
                No transfer requests yet.
              </Text>
            ) : (
              requests.map((request) => (
                <View
                  key={request._id}
                  style={styles.requestCard}
                >
                  <Text style={styles.requestTitle}>
                    {request.currentRoom?.roomNumber ||
                      "Current Room"}{" "}
                    →{" "}
                    {request.newRoom?.roomNumber ||
                      "Requested Room"}
                  </Text>

                  <Text style={styles.detail}>
                    Reason: {request.reason}
                  </Text>

                  <Text
                    style={[
                      styles.status,
                      getStatusStyle(request.status),
                    ]}
                  >
                    {request.status}
                  </Text>
                </View>
              ))
            )}
          </View>
        </>
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

  loadingContainer: {
    alignItems: "center",
    paddingTop: 40,
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
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

  roomOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E4EC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    backgroundColor: "#FAFBFF",
  },

  selectedRoom: {
    borderColor: "#8B5A2B",
    backgroundColor: "#F5EDE6",
  },

  roomNumber: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  roomDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  selectedText: {
    color: "#8B5A2B",
    fontSize: 24,
    fontWeight: "800",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#D5D9E2",
    borderRadius: 16,
    padding: 15,
    minHeight: 120,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#FAFBFF",
  },

  submitButton: {
    backgroundColor: "#8B5A2B",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 18,
  },

  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  requestCard: {
    backgroundColor: "#F5F7FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  requestTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
    marginBottom: 8,
  },

  detail: {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
  },

  status: {
    alignSelf: "flex-start",
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
    fontSize: 15,
    color: "#777",
  },
});