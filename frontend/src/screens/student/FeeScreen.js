import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function FeeScreen({ navigation }) {
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFeeDetails = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/fees/my");

      console.log("Fee details:", response.data);

      setFee(response.data);
    } catch (error) {
      console.log(
        "Fee error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Fee Error",
        error.response?.data?.message ||
          "Unable to load your fee details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeDetails();
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
            Loading fee details...
          </Text>
        </View>
      </GlassBackground>
    );
  }

  if (!fee) {
    return (
      <GlassBackground>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No Fee Details
          </Text>

          <Text style={styles.emptyText}>
            No fee information is currently available.
          </Text>
        </View>
      </GlassBackground>
    );
  }

  const formattedDueDate = new Date(
    fee.dueDate
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <GlassBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
      {/* Amount Card */}
      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>
          Total Fee
        </Text>

        <Text style={styles.amount}>
          Rs. {fee.fee?.toLocaleString()}
        </Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {fee.status}
          </Text>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          💰 Fee Information
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            Amount
          </Text>

          <Text style={styles.value}>
            Rs. {fee.fee?.toLocaleString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Status
          </Text>

          <Text
            style={[
              styles.value,
              fee.status === "Paid"
                ? styles.paid
                : styles.unpaid,
            ]}
          >
            {fee.status}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Due Date
          </Text>

          <Text style={styles.value}>
            {formattedDueDate}
          </Text>
        </View>
      </View>

      {/* Room Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          🛏 Room Information
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            Room
          </Text>

          <Text style={styles.value}>
            {fee.room?.roomNumber}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Room Type
          </Text>

          <Text style={styles.value}>
            {fee.room?.roomType}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Capacity
          </Text>

          <Text style={styles.value}>
            {fee.room?.capacity}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Occupied
          </Text>

          <Text style={styles.value}>
            {fee.room?.occupied}
          </Text>
        </View>
      </View>

      {/* Payment Button */}
      {fee.status !== "Paid" && (
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => navigation.navigate("Payment")}
        >
          <Text style={styles.paymentButtonText}>
            💳 Pay Fee
          </Text>
        </TouchableOpacity>
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
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },

  amountCard: {
    backgroundColor: "#8B5A2B",
    borderRadius: 20,
    padding: 25,
    marginBottom: 18,
    alignItems: "center",
  },

  amountLabel: {
    color: "#DCE6FF",
    fontSize: 15,
    fontWeight: "600",
  },

  amount: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 5,
  },

  statusBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 15,
  },

  statusText: {
    color: "#D64545",
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  label: {
    fontSize: 15,
    color: "#777",
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  unpaid: {
    color: "#D64545",
  },

  paid: {
    color: "#20A05A",
  },

  paymentButton: {
    backgroundColor: "#20A05A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 2,
  },

  paymentButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  
});