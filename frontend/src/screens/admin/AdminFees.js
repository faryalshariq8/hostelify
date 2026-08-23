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

export default function AdminFees({ navigation }) {
  const [fees, setFees] = useState([]);
  const [hostels, setHostels] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  const [selectedHostel, setSelectedHostel] =
    useState(null);

  const [roomType, setRoomType] =
    useState("Double");

  const [amount, setAmount] = useState("");

  const roomTypes = [
    "Single",
    "Double",
    "Triple",
    "Shared",
  ];

  const loadData = async () => {
    try {
      setLoading(true);

      const [feesResponse, hostelsResponse] =
        await Promise.all([
          apiClient.get("/fees"),
          apiClient.get("/hostels", {
            params: {
              limit: 100,
            },
          }),
        ]);

      setFees(feesResponse.data || []);
      setHostels(
        hostelsResponse.data.hostels || []
      );
    } catch (error) {
      console.log(
        "Fees error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load fee information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddForm = () => {
    setEditingFee(null);
    setSelectedHostel(null);
    setRoomType("Double");
    setAmount("");
    setShowForm(true);
  };

  const openEditForm = (fee) => {
    setEditingFee(fee);

    setSelectedHostel(fee.hostel?._id);
    setRoomType(fee.roomType);
    setAmount(String(fee.amount));

    setShowForm(true);
  };

  const handleSave = async () => {
    if (!selectedHostel) {
      Alert.alert(
        "Validation",
        "Please select a hostel."
      );
      return;
    }

    if (!amount.trim()) {
      Alert.alert(
        "Validation",
        "Please enter the fee amount."
      );
      return;
    }

    const numericAmount = Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount < 0
    ) {
      Alert.alert(
        "Validation",
        "Please enter a valid fee amount."
      );
      return;
    }

    try {
      setSaving(true);

      const feeData = {
        hostel: selectedHostel,
        roomType,
        amount: numericAmount,
      };

      if (editingFee) {
        await apiClient.put(
          `/fees/${editingFee._id}`,
          feeData
        );

        Alert.alert(
          "Success",
          "Fee structure updated successfully."
        );
      } else {
        await apiClient.post(
          "/fees",
          feeData
        );

        Alert.alert(
          "Success",
          "Fee structure created successfully."
        );
      }

      setShowForm(false);
      setEditingFee(null);

      await loadData();
    } catch (error) {
      console.log(
        "Save fee error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Save Failed",
        error.response?.data?.message ||
          "Unable to save fee structure."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (fee) => {
    Alert.alert(
      "Delete Fee Structure",
      `Delete the ${fee.roomType} fee structure for ${fee.hostel?.name || "this hostel"}?`,
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
                `/fees/${fee._id}`
              );

              Alert.alert(
                "Deleted",
                "Fee structure deleted successfully."
              );

              await loadData();
            } catch (error) {
              Alert.alert(
                "Delete Failed",
                error.response?.data?.message ||
                  "Unable to delete fee structure."
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#8B5A2B"
          />

          <Text style={styles.loadingText}>
            Loading fees...
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

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Fees
          </Text>

          <Text style={styles.subtitle}>
            Manage hostel fee structures
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

      {/* FORM */}

      {showForm && (
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {editingFee
                ? "Edit Fee Structure"
                : "Add Fee Structure"}
            </Text>

            <TouchableOpacity
              onPress={() =>
                setShowForm(false)
              }
            >
              <Text style={styles.closeText}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>
            Hostel
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {hostels.map((hostel) => (
              <TouchableOpacity
                key={hostel._id}
                style={[
                  styles.optionButton,
                  selectedHostel ===
                    hostel._id &&
                    styles.selectedOption,
                ]}
                onPress={() =>
                  setSelectedHostel(
                    hostel._id
                  )
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedHostel ===
                      hostel._id &&
                      styles.selectedOptionText,
                  ]}
                >
                  {hostel.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.inputLabel}>
            Room Type
          </Text>

          <View style={styles.roomTypeContainer}>
            {roomTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  roomType === type &&
                    styles.selectedOption,
                ]}
                onPress={() =>
                  setRoomType(type)
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    roomType === type &&
                      styles.selectedOptionText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>
            Fee Amount
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 25000"
            placeholderTextColor="#999"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

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
              <Text
                style={styles.saveButtonText}
              >
                {editingFee
                  ? "Save Changes"
                  : "Create Fee Structure"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* EMPTY */}

      {fees.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            💰
          </Text>

          <Text style={styles.emptyTitle}>
            No Fee Structures
          </Text>

          <Text style={styles.emptyText}>
            Add fee structures for your
            hostels and room types.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={openAddForm}
          >
            <Text style={styles.emptyButtonText}>
              + Add Fee Structure
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        fees.map((fee) => (
          <View
            key={fee._id}
            style={styles.feeCard}
          >
            <View style={styles.feeHeader}>
              <View style={styles.feeIcon}>
                <Text>💰</Text>
              </View>

              <View style={styles.feeInfo}>
                <Text style={styles.hostelName}>
                  {fee.hostel?.name ||
                    "Unknown Hostel"}
                </Text>

                <Text style={styles.roomType}>
                  {fee.roomType} Room
                </Text>
              </View>

              <Text style={styles.amount}>
                {Number(
                  fee.amount
                ).toLocaleString()}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  openEditForm(fee)
                }
              >
                <Text
                  style={styles.editButtonText}
                >
                  ✏️ Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  handleDelete(fee)
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

  headerText: {
    flex: 1,
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

  addButton: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#8B5A2B",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFF",
    fontSize: 28,
    lineHeight: 30,
  },

  formCard: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },

  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  formTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
  },

  closeText: {
    fontSize: 20,
    color: "#777",
  },

  inputLabel: {
    marginTop: 12,
    marginBottom: 7,
    fontWeight: "700",
    color: "#333",
  },

  input: {
    backgroundColor: "#F7F8FA",
    borderRadius: 11,
    paddingHorizontal: 14,
    height: 48,
    color: "#222",
  },

  roomTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  optionButton: {
    borderWidth: 1,
    borderColor: "#D8DCE5",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginRight: 7,
    marginBottom: 7,
  },

  selectedOption: {
    backgroundColor: "#8B5A2B",
    borderColor: "#8B5A2B",
  },

  optionText: {
    color: "#555",
    fontWeight: "600",
  },

  selectedOptionText: {
    color: "#FFF",
  },

  saveButton: {
    marginTop: 18,
    backgroundColor: "#8B5A2B",
    height: 48,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  feeCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 17,
    marginBottom: 14,
    elevation: 2,
  },

  feeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  feeIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#F5EDE6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  feeInfo: {
    flex: 1,
  },

  hostelName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
  },

  roomType: {
    marginTop: 4,
    color: "#777",
  },

  amount: {
    fontSize: 17,
    fontWeight: "800",
    color: "#8B5A2B",
  },

  actions: {
    flexDirection: "row",
    marginTop: 15,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#F5EDE6",
    paddingVertical: 11,
    borderRadius: 10,
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
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 7,
  },

  deleteButtonText: {
    color: "#E53935",
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 35,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: 7,
    textAlign: "center",
    color: "#777",
  },

  emptyButton: {
    marginTop: 18,
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  emptyButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});