import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";

export default function AdminStudentsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(
        "/users/students",
        {
          params: {
            search,
            page: 1,
            limit: 20,
          },
        }
      );

      setStudents(response.data.students || []);
    } catch (error) {
      console.log(
        "Students error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Student",
      "Are you sure you want to delete this student?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(`/users/students/${id}`);
              Alert.alert("Success", "Student removed successfully.");
              loadStudents();
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to delete student."
              );
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const renderStudent = ({ item }) => {
    const initial =
      item.fullName?.charAt(0)?.toUpperCase() || "U";

    return (
      <View style={styles.studentCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initial}
          </Text>
        </View>

        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>
            {item.fullName}
          </Text>

          <Text style={styles.studentEmail}>
            {item.email}
          </Text>

          <Text style={styles.studentRole}>
            {item.role}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.deleteButtonText}>🗑</Text>
        </TouchableOpacity>
      </View>
    );
  };

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

        <Text style={styles.title}>
          Students
        </Text>

        <View style={{ width: 42 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={loadStudents}
        >
          <Text style={styles.searchButtonText}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Students */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#8B5A2B"
          />

          <Text style={styles.loadingText}>
            Loading students...
          </Text>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item._id}
          renderItem={renderStudent}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                No Students Found
              </Text>

              <Text style={styles.emptyText}>
                No registered students match your search.
              </Text>
            </View>
          }
        />
        )}
      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#222",
  },

  searchContainer: {
    flexDirection: "row",
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },

  searchButton: {
    marginLeft: 10,
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 18,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  searchButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  list: {
    paddingBottom: 30,
  },

  studentCard: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#8B5A2B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#FFF",
    fontSize: 21,
    fontWeight: "800",
  },

  studentInfo: {
    flex: 1,
  },

  studentName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
  },

  studentEmail: {
    fontSize: 14,
    color: "#777",
    marginTop: 3,
  },

  studentRole: {
    fontSize: 13,
    color: "#8B5A2B",
    fontWeight: "700",
    marginTop: 5,
  },

  deleteButton: {
    padding: 10,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 12,
  },

  deleteButtonText: {
    fontSize: 18,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#222",
  },

  emptyText: {
    marginTop: 8,
    textAlign: "center",
    color: "#777",
    fontSize: 15,
  },
});