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

export default function PaymentHistoryScreen({ navigation }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      const response = await apiClient.get(
        "/payments/history"
      );

      console.log(
        "Payment history:",
        response.data
      );

      setPayments(
        Array.isArray(response.data)
          ? response.data
          : response.data.payments || []
      );
    } catch (error) {
      console.log(
        "Payment history error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load payment history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
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
            Loading payment history...
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
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Payment History
        </Text>
      </View>

      {payments.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            💳
          </Text>

          <Text style={styles.emptyTitle}>
            No Payments Yet
          </Text>

          <Text style={styles.emptyText}>
            Your completed payments will appear here.
          </Text>
        </View>
      ) : (
        payments.map((payment, index) => (
          <View
            key={payment._id || index}
            style={styles.paymentCard}
          >
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentTitle}>
                Payment #{payments.length - index}
              </Text>

              <Text style={styles.paidBadge}>
                {payment.status || "Paid"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Amount
              </Text>

              <Text style={styles.amount}>
                Rs.{" "}
                {payment.amount?.toLocaleString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Method
              </Text>

              <Text style={styles.value}>
                {payment.paymentMethod ||
                  "Card"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Semester
              </Text>

              <Text style={styles.value}>
                {payment.semester || "N/A"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Transaction ID
              </Text>

              <Text
                style={styles.transaction}
                numberOfLines={1}
              >
                {payment.transactionId ||
                  "N/A"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Receipt
              </Text>

              <Text style={styles.value}>
                {payment.receiptNumber ||
                  "N/A"}
              </Text>
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
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    elevation: 2,
  },

  backText: {
    fontSize: 34,
    color: "#8B5A2B",
    lineHeight: 38,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 35,
    alignItems: "center",
    elevation: 3,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
    fontSize: 15,
  },

  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },

  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  paymentTitle: {
    fontSize: 19,
    fontWeight: "800",
  },

  paidBadge: {
    backgroundColor: "#E5F7EC",
    color: "#20A05A",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    fontWeight: "800",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  label: {
    color: "#777",
    fontSize: 14,
  },

  value: {
    color: "#222",
    fontSize: 15,
    fontWeight: "700",
    maxWidth: "60%",
    textAlign: "right",
  },

  amount: {
    color: "#8B5A2B",
    fontSize: 17,
    fontWeight: "800",
  },

  transaction: {
    color: "#555",
    fontSize: 12,
    maxWidth: "55%",
  },
});