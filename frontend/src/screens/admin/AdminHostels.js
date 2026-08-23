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
  Image,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function AdminHostels({ navigation }) {
  const [hostels, setHostels] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [totalRooms, setTotalRooms] = useState("");
  const [availableRooms, setAvailableRooms] = useState("");

  // -----------------------------------------
  // LOAD HOSTELS
  // -----------------------------------------

  const loadHostels = async (selectedPage = page, searchValue = search) => {
    try {
      setLoading(true);

      const response = await apiClient.get("/hostels", {
        params: {
          search: searchValue,
          page: selectedPage,
          limit: 10,
          sort: "-createdAt",
        },
      });

      setHostels(response.data.hostels || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(
        "Hostels error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load hostels."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostels(1, "");
  }, []);

  // -----------------------------------------
  // SEARCH
  // -----------------------------------------

  const handleSearch = () => {
    setPage(1);
    loadHostels(1, search);
  };

  // -----------------------------------------
  // OPEN ADD FORM
  // -----------------------------------------

  const openAddForm = () => {
    setEditingHostel(null);

    setName("");
    setLocation("");
    setDescription("");
    setImageUrl("");
    setTotalRooms("");
    setAvailableRooms("");

    setShowForm(true);
  };

  // -----------------------------------------
  // OPEN EDIT FORM
  // -----------------------------------------

  const openEditForm = (hostel) => {
    setEditingHostel(hostel);

    setName(hostel.name || "");
    setLocation(hostel.location || "");
    setDescription(hostel.description || "");
    setImageUrl(hostel.image || "");
    setTotalRooms(String(hostel.totalRooms ?? ""));
    setAvailableRooms(String(hostel.availableRooms ?? ""));

    setShowForm(true);
  };

  // -----------------------------------------
  // SAVE HOSTEL
  // -----------------------------------------

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter the hostel name.");
      return;
    }

    if (!location.trim()) {
      Alert.alert("Validation", "Please enter the hostel location.");
      return;
    }

    if (!totalRooms.trim()) {
      Alert.alert("Validation", "Please enter the total number of rooms.");
      return;
    }

    if (!availableRooms.trim()) {
      Alert.alert(
        "Validation",
        "Please enter the number of available rooms."
      );
      return;
    }

    const total = Number(totalRooms);
    const available = Number(availableRooms);

    if (Number.isNaN(total) || total < 0) {
      Alert.alert(
        "Validation",
        "Total rooms must be a valid positive number."
      );
      return;
    }

    if (Number.isNaN(available) || available < 0) {
      Alert.alert(
        "Validation",
        "Available rooms must be a valid positive number."
      );
      return;
    }

    if (available > total) {
      Alert.alert(
        "Validation",
        "Available rooms cannot be greater than total rooms."
      );
      return;
    }

    try {
      setSaving(true);

      const hostelData = {
        name: name.trim(),
        location: location.trim(),
        description: description.trim(),
        image: imageUrl.trim(),
        totalRooms: total,
        availableRooms: available,
      };

      if (editingHostel) {
        await apiClient.put(
          `/hostels/${editingHostel._id}`,
          hostelData
        );

        Alert.alert(
          "Success",
          "Hostel updated successfully."
        );
      } else {
        await apiClient.post("/hostels", hostelData);

        Alert.alert(
          "Success",
          "Hostel created successfully."
        );
      }

      setShowForm(false);

      setEditingHostel(null);

      await loadHostels(page, search);
    } catch (error) {
      console.log(
        "Save hostel error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Save Failed",
        error.response?.data?.message ||
          "Unable to save hostel."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // DELETE HOSTEL
  // -----------------------------------------

  const handleDelete = (hostel) => {
    Alert.alert(
      "Delete Hostel",
      `Are you sure you want to delete "${hostel.name}"?`,
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
                `/hostels/${hostel._id}`
              );

              Alert.alert(
                "Deleted",
                "Hostel deleted successfully."
              );

              // If the current page becomes empty,
              // move back one page.
              if (hostels.length === 1 && page > 1) {
                const newPage = page - 1;

                setPage(newPage);

                await loadHostels(
                  newPage,
                  search
                );
              } else {
                await loadHostels(
                  page,
                  search
                );
              }
            } catch (error) {
              console.log(
                "Delete hostel error:",
                error.response?.data || error.message
              );

              Alert.alert(
                "Delete Failed",
                error.response?.data?.message ||
                  "Unable to delete hostel."
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

    loadHostels(newPage, search);
  };

  const goToNextPage = () => {
    if (page >= totalPages) return;

    const newPage = page + 1;

    setPage(newPage);

    loadHostels(newPage, search);
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading && hostels.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#8B5A2B"
        />

        <Text style={styles.loadingText}>
          Loading hostels...
        </Text>
      </View>
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
            Hostels
          </Text>

          <Text style={styles.subtitle}>
            Manage hostel properties
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

      {/* Search */}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search hostels..."
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

      {/* Add / Edit Form */}

      {showForm && (
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {editingHostel
                ? "Edit Hostel"
                : "Add New Hostel"}
            </Text>

            <TouchableOpacity
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.closeText}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>
            Hostel Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Sunrise Residence"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>
            Location
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Islamabad"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.inputLabel}>
            Description
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
            ]}
            placeholder="Describe the hostel..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.inputLabel}>
            Hostel Image URL
          </Text>

          <TextInput
            style={styles.input}
            placeholder="https://res.cloudinary.com/....jpg"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.inputLabel}>
            Total Rooms
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 50"
            value={totalRooms}
            onChangeText={setTotalRooms}
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>
            Available Rooms
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 20"
            value={availableRooms}
            onChangeText={setAvailableRooms}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              saving && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                {editingHostel
                  ? "Save Changes"
                  : "Create Hostel"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}

      {hostels.length === 0 && !loading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            🏢
          </Text>

          <Text style={styles.emptyTitle}>
            No Hostels Found
          </Text>

          <Text style={styles.emptyText}>
            {search
              ? "No hostels match your search."
              : "You haven't added any hostels yet."}
          </Text>

          {!search && (
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={openAddForm}
            >
              <Text style={styles.emptyButtonText}>
                + Add Hostel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          {/* Hostel Cards */}

          {hostels.map((hostel) => (
            <View
              key={hostel._id}
              style={styles.hostelCard}
            >
              {hostel.image ? (
                <Image
                  source={{ uri: hostel.image }}
                  style={styles.hostelImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.hostelImagePlaceholder}>
                  <Text style={styles.hostelImagePlaceholderText}>🏢</Text>
                </View>
              )}

              <View style={styles.cardTop}>
                <View style={styles.hostelIcon}>
                  <Text style={styles.hostelIconText}>
                    🏢
                  </Text>
                </View>

                <View style={styles.hostelMain}>
                  <Text style={styles.hostelName}>
                    {hostel.name}
                  </Text>

                  <Text style={styles.location}>
                    📍 {hostel.location}
                  </Text>
                </View>
              </View>

              {hostel.description ? (
                <Text
                  style={styles.description}
                  numberOfLines={2}
                >
                  {hostel.description}
                </Text>
              ) : null}

              {/* Stats */}

              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {hostel.totalRooms}
                  </Text>

                  <Text style={styles.statLabel}>
                    Total Rooms
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.stat}>
                  <Text
                    style={[
                      styles.statValue,
                      styles.availableValue,
                    ]}
                  >
                    {hostel.availableRooms}
                  </Text>

                  <Text style={styles.statLabel}>
                    Available
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {Math.max(
                      0,
                      hostel.totalRooms -
                        hostel.availableRooms
                    )}
                  </Text>

                  <Text style={styles.statLabel}>
                    Occupied
                  </Text>
                </View>
              </View>

              {/* Actions */}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    openEditForm(hostel)
                  }
                >
                  <Text style={styles.editButtonText}>
                    ✏️ Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    handleDelete(hostel)
                  }
                >
                  <Text
                    style={styles.deleteButtonText}
                  >
                    🗑 Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Pagination */}

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
                <Text
                  style={styles.pageButtonText}
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
                disabled={page === totalPages}
              >
                <Text
                  style={styles.pageButtonText}
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

  // Header

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#F5EDE6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  backButtonText: {
    fontSize: 25,
    color: "#8B5A2B",
    fontWeight: "700",
  },

  headerTextContainer: {
    flex: 1,
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
    fontWeight: "500",
    marginTop: -2,
  },

  // Search

  searchContainer: {
    flexDirection: "row",
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E8EF",
    fontSize: 15,
    color: "#222",
  },

  searchButton: {
    marginLeft: 8,
    height: 48,
    paddingHorizontal: 17,
    borderRadius: 14,
    backgroundColor: "#8B5A2B",
    justifyContent: "center",
    alignItems: "center",
  },

  searchButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  // Form

  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#222",
  },

  closeText: {
    fontSize: 20,
    color: "#777",
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    marginTop: 10,
    marginBottom: 7,
  },

  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E1E5ED",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#222",
  },

  descriptionInput: {
    minHeight: 85,
    textAlignVertical: "top",
  },

  saveButton: {
    marginTop: 18,
    backgroundColor: "#8B5A2B",
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },

  // Empty

  emptyCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 35,
    alignItems: "center",
    marginTop: 5,
    elevation: 2,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#222",
  },

  emptyText: {
    marginTop: 7,
    textAlign: "center",
    fontSize: 14,
    color: "#777",
    lineHeight: 21,
  },

  emptyButton: {
    marginTop: 18,
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },

  emptyButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  // Hostel Card

  hostelCard: {
    backgroundColor: "rgba(255, 255, 255, 0.42)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.55)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  hostelImage: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: "#E9E0D4",
  },

  hostelImagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: "rgba(245, 237, 230, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  hostelImagePlaceholderText: {
    fontSize: 42,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  hostelIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#F5EDE6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  hostelIconText: {
    fontSize: 25,
  },

  hostelMain: {
    flex: 1,
  },

  hostelName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
  },

  location: {
    marginTop: 4,
    fontSize: 14,
    color: "#777",
  },

  description: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },

  // Stats

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 17,
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },

  availableValue: {
    color: "#20A05A",
  },

  statLabel: {
    marginTop: 3,
    fontSize: 11,
    color: "#777",
  },

  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#E0E3E9",
  },

  // Actions

  actions: {
    flexDirection: "row",
    marginTop: 15,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#F5EDE6",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 7,
  },

  editButtonText: {
    color: "#8B5A2B",
    fontWeight: "700",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#FFF0F0",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 7,
  },

  deleteButtonText: {
    color: "#D64545",
    fontWeight: "700",
  },

  // Pagination

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 10,
  },

  pageButton: {
    backgroundColor: "#F5EDE6",
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 11,
  },

  disabledPageButton: {
    opacity: 0.4,
  },

  pageButtonText: {
    color: "#8B5A2B",
    fontWeight: "700",
    fontSize: 13,
  },

  pageText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
  },
});