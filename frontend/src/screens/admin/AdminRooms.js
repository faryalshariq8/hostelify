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

export default function AdminRooms({ navigation }) {
  const [rooms, setRooms] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [hostels, setHostels] = useState([]);

  const [hostel, setHostel] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [occupied, setOccupied] = useState("0");
  const [roomType, setRoomType] = useState("Double");
  const [fee, setFee] = useState("");

  // -----------------------------------------
  // LOAD HOSTELS
  // -----------------------------------------

  const loadHostels = async () => {
    try {
      const response = await apiClient.get("/hostels", {
        params: {
          page: 1,
          limit: 100,
          sort: "name",
        },
      });

      setHostels(response.data.hostels || []);
    } catch (error) {
      console.log(
        "Hostels error:",
        error.response?.data || error.message
      );
    }
  };

  // -----------------------------------------
  // LOAD ROOMS
  // -----------------------------------------

  const loadRooms = async (
    selectedPage = page,
    searchValue = search
  ) => {
    try {
      setLoading(true);

      const response = await apiClient.get("/rooms", {
        params: {
          search: searchValue,
          page: selectedPage,
          limit: 10,
          sort: "roomNumber",
        },
      });

      setRooms(response.data.rooms || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(
        "Rooms error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load rooms."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms(1, "");
    loadHostels();
  }, []);

  // -----------------------------------------
  // SEARCH
  // -----------------------------------------

  const handleSearch = () => {
    setPage(1);
    loadRooms(1, search);
  };

  // -----------------------------------------
  // RESET FORM
  // -----------------------------------------

  const resetForm = () => {
    setEditingRoom(null);
    setHostel("");
    setRoomNumber("");
    setCapacity("");
    setOccupied("0");
    setRoomType("Double");
    setFee("");
  };

  // -----------------------------------------
  // OPEN ADD FORM
  // -----------------------------------------

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // -----------------------------------------
  // OPEN EDIT FORM
  // -----------------------------------------

  const openEditForm = (room) => {
    setEditingRoom(room);

    setHostel(
      typeof room.hostel === "object"
        ? room.hostel?._id
        : room.hostel || ""
    );

    setRoomNumber(room.roomNumber || "");
    setCapacity(String(room.capacity ?? ""));
    setOccupied(String(room.occupied ?? 0));
    setRoomType(room.roomType || "Double");
    setFee(String(room.fee ?? ""));

    setShowForm(true);
  };

  // -----------------------------------------
  // SAVE ROOM
  // -----------------------------------------

  const handleSave = async () => {
    if (!editingRoom && !hostel) {
      Alert.alert(
        "Validation",
        "Please select a hostel."
      );
      return;
    }

    if (!roomNumber.trim()) {
      Alert.alert(
        "Validation",
        "Please enter the room number."
      );
      return;
    }

    if (!capacity.trim()) {
      Alert.alert(
        "Validation",
        "Please enter the room capacity."
      );
      return;
    }

    if (!fee.trim()) {
      Alert.alert(
        "Validation",
        "Please enter the room fee."
      );
      return;
    }

    const capacityNumber = Number(capacity);
    const occupiedNumber = Number(occupied);
    const feeNumber = Number(fee);

    if (
      Number.isNaN(capacityNumber) ||
      capacityNumber < 1
    ) {
      Alert.alert(
        "Validation",
        "Capacity must be at least 1."
      );
      return;
    }

    if (
      Number.isNaN(occupiedNumber) ||
      occupiedNumber < 0
    ) {
      Alert.alert(
        "Validation",
        "Occupied must be a valid number."
      );
      return;
    }

    if (occupiedNumber > capacityNumber) {
      Alert.alert(
        "Validation",
        "Occupied cannot exceed capacity."
      );
      return;
    }

    if (
      Number.isNaN(feeNumber) ||
      feeNumber < 0
    ) {
      Alert.alert(
        "Validation",
        "Fee must be a valid positive number."
      );
      return;
    }

    try {
      setSaving(true);

      const roomData = {
        roomNumber: roomNumber.trim(),
        capacity: capacityNumber,
        occupied: occupiedNumber,
        roomType,
        fee: feeNumber,
      };

      if (!editingRoom) {
        roomData.hostel = hostel;
      }

      if (editingRoom) {
        await apiClient.put(
          `/rooms/${editingRoom._id}`,
          roomData
        );

        Alert.alert(
          "Success",
          "Room updated successfully."
        );
      } else {
        await apiClient.post(
          "/rooms",
          roomData
        );

        Alert.alert(
          "Success",
          "Room created successfully."
        );
      }

      setShowForm(false);
      resetForm();

      await loadRooms(page, search);
    } catch (error) {
      console.log(
        "Save room error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Save Failed",
        error.response?.data?.message ||
          "Unable to save room."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // DELETE ROOM
  // -----------------------------------------

  const handleDelete = (room) => {
    Alert.alert(
      "Delete Room",
      `Are you sure you want to delete room "${room.roomNumber}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(
                `/rooms/${room._id}`
              );

              Alert.alert(
                "Deleted",
                "Room deleted successfully."
              );

              if (
                rooms.length === 1 &&
                page > 1
              ) {
                const newPage = page - 1;

                setPage(newPage);

                await loadRooms(
                  newPage,
                  search
                );
              } else {
                await loadRooms(
                  page,
                  search
                );
              }
            } catch (error) {
              console.log(
                "Delete room error:",
                error.response?.data ||
                  error.message
              );

              Alert.alert(
                "Delete Failed",
                error.response?.data?.message ||
                  "Unable to delete room."
              );
            }
          },
        },
      ]
    );
  };

  // -----------------------------------------
  // PAGINATION
  // -----------------------------------------

  const goToPreviousPage = () => {
    if (page <= 1) return;

    const newPage = page - 1;

    setPage(newPage);

    loadRooms(newPage, search);
  };

  const goToNextPage = () => {
    if (page >= totalPages) return;

    const newPage = page + 1;

    setPage(newPage);

    loadRooms(newPage, search);
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading && rooms.length === 0) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#8B5A2B"
          />

          <Text style={styles.loadingText}>
            Loading rooms...
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
          <Text style={styles.backButtonText}>
            ←
          </Text>
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            Rooms
          </Text>

          <Text style={styles.subtitle}>
            Manage hostel rooms
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddForm}
        >
          <Text style={styles.addButtonText}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search rooms..."
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

      {/* FORM */}

      {showForm && (
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {editingRoom
                ? "Edit Room"
                : "Add New Room"}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              <Text style={styles.closeText}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* HOSTEL */}

          {!editingRoom && (
            <>
              <Text style={styles.inputLabel}>
                Hostel
              </Text>

              {hostels.length === 0 ? (
                <Text style={styles.noHostelsText}>
                  No hostels available. Create a
                  hostel first.
                </Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.hostelSelector}
                >
                  {hostels.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      style={[
                        styles.hostelOption,
                        hostel === item._id &&
                          styles.selectedHostelOption,
                      ]}
                      onPress={() =>
                        setHostel(item._id)
                      }
                    >
                      <Text
                        style={[
                          styles.hostelOptionText,
                          hostel === item._id &&
                            styles.selectedHostelOptionText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </>
          )}

          {/* ROOM NUMBER */}

          <Text style={styles.inputLabel}>
            Room Number
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. A-101"
            value={roomNumber}
            onChangeText={setRoomNumber}
          />

          {/* CAPACITY */}

          <Text style={styles.inputLabel}>
            Capacity
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 2"
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="numeric"
          />

          {/* OCCUPIED */}

          <Text style={styles.inputLabel}>
            Occupied
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 1"
            value={occupied}
            onChangeText={setOccupied}
            keyboardType="numeric"
          />

          {/* ROOM TYPE */}

          <Text style={styles.inputLabel}>
            Room Type
          </Text>

          <View style={styles.typeContainer}>
            {["Single", "Double", "Triple"].map(
              (type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    roomType === type &&
                      styles.selectedTypeButton,
                  ]}
                  onPress={() =>
                    setRoomType(type)
                  }
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      roomType === type &&
                        styles.selectedTypeButtonText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* FEE */}

          <Text style={styles.inputLabel}>
            Room Fee
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 25000"
            value={fee}
            onChangeText={setFee}
            keyboardType="numeric"
          />

          {/* SAVE */}

          <TouchableOpacity
            style={[
              styles.saveButton,
              saving &&
                styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                {editingRoom
                  ? "Save Changes"
                  : "Create Room"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* EMPTY STATE */}

      {rooms.length === 0 && !loading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            🛏
          </Text>

          <Text style={styles.emptyTitle}>
            No Rooms Found
          </Text>

          <Text style={styles.emptyText}>
            {search
              ? "No rooms match your search."
              : "You haven't added any rooms yet."}
          </Text>

          {!search && (
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={openAddForm}
            >
              <Text style={styles.emptyButtonText}>
                + Add Room
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          {/* ROOM CARDS */}

          {rooms.map((room) => {
            const available =
              Math.max(
                0,
                room.capacity - room.occupied
              );

            return (
              <View
                key={room._id}
                style={styles.roomCard}
              >
                <View style={styles.cardTop}>
                  <View style={styles.roomIcon}>
                    <Text
                      style={
                        styles.roomIconText
                      }
                    >
                      🛏
                    </Text>
                  </View>

                  <View
                    style={styles.roomMain}
                  >
                    <Text
                      style={styles.roomNumber}
                    >
                      Room {room.roomNumber}
                    </Text>

                    <Text
                      style={styles.hostelName}
                    >
                      🏢{" "}
                      {room.hostel?.name ||
                        "Unknown Hostel"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      room.isAvailable
                        ? styles.availableBadge
                        : styles.fullBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        room.isAvailable
                          ? styles.availableText
                          : styles.fullText,
                      ]}
                    >
                      {room.isAvailable
                        ? "Available"
                        : "Full"}
                    </Text>
                  </View>
                </View>

                {/* DETAILS */}

                <View style={styles.detailsContainer}>
                  <View style={styles.detail}>
                    <Text style={styles.detailValue}>
                      {room.roomType}
                    </Text>

                    <Text style={styles.detailLabel}>
                      Type
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.detail}>
                    <Text style={styles.detailValue}>
                      {room.capacity}
                    </Text>

                    <Text style={styles.detailLabel}>
                      Capacity
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.detail}>
                    <Text style={styles.detailValue}>
                      {room.occupied}
                    </Text>

                    <Text style={styles.detailLabel}>
                      Occupied
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.detail}>
                    <Text
                      style={[
                        styles.detailValue,
                        styles.availableValue,
                      ]}
                    >
                      {available}
                    </Text>

                    <Text style={styles.detailLabel}>
                      Free
                    </Text>
                  </View>
                </View>

                {/* FEE */}

                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>
                    Monthly Fee
                  </Text>

                  <Text style={styles.feeValue}>
                    Rs.{" "}
                    {Number(
                      room.fee || 0
                    ).toLocaleString()}
                  </Text>
                </View>

                {/* ACTIONS */}

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      openEditForm(room)
                    }
                  >
                    <Text
                      style={
                        styles.editButtonText
                      }
                    >
                      ✏️ Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      handleDelete(room)
                    }
                  >
                    <Text
                      style={
                        styles.deleteButtonText
                      }
                    >
                      🗑 Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {/* PAGINATION */}

          {totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  page === 1 &&
                    styles.disabledPageButton,
                ]}
                onPress={
                  goToPreviousPage
                }
                disabled={page === 1}
              >
                <Text
                  style={
                    styles.pageButtonText
                  }
                >
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
                disabled={
                  page === totalPages
                }
              >
                <Text
                  style={
                    styles.pageButtonText
                  }
                >
                  Next →
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
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
    marginLeft: 14,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#222",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 14,
    color: "#777",
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#8B5A2B",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "400",
  },

  searchContainer: {
    flexDirection: "row",
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E2E5EC",
    fontSize: 15,
    color: "#222",
  },

  searchButton: {
    marginLeft: 8,
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#8B5A2B",
    justifyContent: "center",
    alignItems: "center",
  },

  searchButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },

  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  formTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#222",
  },

  closeText: {
    fontSize: 20,
    color: "#777",
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginTop: 12,
    marginBottom: 7,
  },

  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E0E4EC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: "#222",
  },

  hostelSelector: {
    marginBottom: 4,
  },

  hostelOption: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F0F2F7",
    marginRight: 8,
  },

  selectedHostelOption: {
    backgroundColor: "#8B5A2B",
  },

  hostelOptionText: {
    color: "#555",
    fontWeight: "600",
  },

  selectedHostelOptionText: {
    color: "#FFF",
  },

  noHostelsText: {
    color: "#D64545",
    marginBottom: 5,
  },

  typeContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#F0F2F7",
    alignItems: "center",
    marginRight: 7,
  },

  selectedTypeButton: {
    backgroundColor: "#8B5A2B",
  },

  typeButtonText: {
    color: "#555",
    fontWeight: "700",
  },

  selectedTypeButtonText: {
    color: "#FFF",
  },

  saveButton: {
    backgroundColor: "#8B5A2B",
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 20,
  },

  disabledButton: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 35,
    alignItems: "center",
    marginTop: 10,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#222",
  },

  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 8,
    lineHeight: 21,
  },

  emptyButton: {
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 11,
    marginTop: 18,
  },

  emptyButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  roomCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  roomIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#F5EDE6",
    justifyContent: "center",
    alignItems: "center",
  },

  roomIconText: {
    fontSize: 25,
  },

  roomMain: {
    flex: 1,
    marginLeft: 12,
  },

  roomNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },

  hostelName: {
    marginTop: 4,
    color: "#777",
    fontSize: 13,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  availableBadge: {
    backgroundColor: "#E7F7EE",
  },

  fullBadge: {
    backgroundColor: "#FDECEC",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },

  availableText: {
    color: "#20A05A",
  },

  fullText: {
    color: "#D64545",
  },

  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    paddingVertical: 14,
    backgroundColor: "#F8F9FC",
    borderRadius: 13,
  },

  detail: {
    flex: 1,
    alignItems: "center",
  },

  detailValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
  },

  detailLabel: {
    fontSize: 11,
    color: "#777",
    marginTop: 3,
  },

  availableValue: {
    color: "#20A05A",
  },

  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#E0E3EA",
  },

  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  feeLabel: {
    color: "#777",
    fontSize: 14,
  },

  feeValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
  },

  actions: {
    flexDirection: "row",
    marginTop: 16,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#F5EDE6",
    paddingVertical: 12,
    borderRadius: 11,
    alignItems: "center",
    marginRight: 6,
  },

  editButtonText: {
    color: "#8B5A2B",
    fontWeight: "700",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#FDECEC",
    paddingVertical: 12,
    borderRadius: 11,
    alignItems: "center",
    marginLeft: 6,
  },

  deleteButtonText: {
    color: "#D64545",
    fontWeight: "700",
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },

  pageButton: {
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
  },

  disabledPageButton: {
    opacity: 0.4,
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