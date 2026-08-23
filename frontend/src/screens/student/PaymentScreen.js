import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function PaymentScreen({ navigation }) {
  const [feeDetails, setFeeDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [semester, setSemester] = useState("Fall 2026");
  const [processing, setProcessing] = useState(false);

  const loadFeeDetails = async () => {
    try {
      const response = await apiClient.get("/fees/my");

      console.log("Payment fee details:", response.data);

      setFeeDetails(response.data);
    } catch (error) {
      console.log(
        "Payment fee error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load fee information."
      );
    }
  };

  useEffect(() => {
    loadFeeDetails();
  }, []);

  const handlePayment = async () => {
    if (!feeDetails?.fee) {
      Alert.alert("Error", "Fee amount is not available.");
      return;
    }

    try {
      setProcessing(true);

      const response = await apiClient.post("/payments/pay", {
        paymentMethod,
        amount: feeDetails.fee,
        semester,
      });

      console.log("Payment response:", response.data);

      Alert.alert(
        "Payment Successful 🎉",
        `Your payment has been recorded successfully.\n\nTransaction ID: ${
          response.data.transactionId || "Generated"
        }\n\nReceipt: ${
          response.data.receiptNumber || "Generated"
        }`,
        [
          {
            text: "View Payment History",
            onPress: () => navigation.navigate("PaymentHistory"),
          },
        ]
      );
    } catch (error) {
      console.log(
        "Payment error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Payment Failed",
        error.response?.data?.message ||
          "Unable to process your payment."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (!feeDetails) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#8B5A2B"
          />

          <Text style={styles.loadingText}>
            Loading payment details...
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

        <Text style={styles.headerTitle}>
          💳 Payment
        </Text>
      </View>

      {/* Amount */}
      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>
          Amount Due
        </Text>

        <Text style={styles.amount}>
          Rs. {feeDetails.fee?.toLocaleString()}
        </Text>

        <Text style={styles.roomText}>
          Room {feeDetails.room?.roomNumber}
        </Text>
      </View>

      {/* Payment Method */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Payment Method
        </Text>

        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentMethod === "Card" &&
              styles.selectedMethod,
          ]}
          onPress={() => setPaymentMethod("Card")}
        >
          <Text
            style={[
              styles.methodText,
              paymentMethod === "Card" &&
                styles.selectedMethodText,
            ]}
          >
            💳 Card
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentMethod === "Cash" &&
              styles.selectedMethod,
          ]}
          onPress={() => setPaymentMethod("Cash")}
        >
          <Text
            style={[
              styles.methodText,
              paymentMethod === "Cash" &&
                styles.selectedMethodText,
            ]}
          >
            💵 Cash
          </Text>
        </TouchableOpacity>
      </View>

      {/* Semester */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Semester
        </Text>

        <TextInput
          value={semester}
          onChangeText={setSemester}
          style={styles.input}
          placeholder="Enter semester"
          placeholderTextColor="#999"
        />
      </View>

      {/* Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Payment Summary
        </Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Fee
          </Text>

          <Text style={styles.summaryValue}>
            Rs. {feeDetails.fee?.toLocaleString()}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Method
          </Text>

          <Text style={styles.summaryValue}>
            {paymentMethod}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Semester
          </Text>

          <Text style={styles.summaryValue}>
            {semester}
          </Text>
        </View>
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={[
          styles.payButton,
          processing && styles.disabledButton,
        ]}
        onPress={handlePayment}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator
            color="#FFFFFF"
          />
        ) : (
          <Text style={styles.payButtonText}>
            💳 Pay Rs. {feeDetails.fee?.toLocaleString()}
          </Text>
        )}
      </TouchableOpacity>
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

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#222",
  },

  amountCard: {
    backgroundColor: "#8B5A2B",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginBottom: 18,
  },

  amountLabel: {
    color: "#DCE6FF",
    fontSize: 16,
    fontWeight: "600",
  },

  amount: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
    marginVertical: 8,
  },

  roomText: {
    color: "#FFFFFF",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 15,
  },

  methodButton: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },

  selectedMethod: {
    backgroundColor: "#F5EDE6",
    borderColor: "#8B5A2B",
  },

  methodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },

  selectedMethodText: {
    color: "#8B5A2B",
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 16,
    color: "#222",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  summaryLabel: {
    color: "#777",
    fontSize: 15,
  },

  summaryValue: {
    fontWeight: "700",
    fontSize: 15,
    color: "#222",
  },

  payButton: {
    backgroundColor: "#20A05A",
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.7,
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});