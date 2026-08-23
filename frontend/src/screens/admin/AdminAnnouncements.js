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

export default function AdminAnnouncements({ navigation }) {
  const [announcements, setAnnouncements] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [targetAudience, setTargetAudience] =
    useState("All");

  const audiences = [
    "All",
    "Students",
    "Hostel Specific",
  ];

  const loadAnnouncements = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(
        "/announcements"
      );

      setAnnouncements(response.data || []);
    } catch (error) {
      console.log(
        "Announcements error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const openAddForm = () => {
    setEditingAnnouncement(null);

    setTitle("");
    setDescription("");
    setTargetAudience("All");

    setShowForm(true);
  };

  const openEditForm = (announcement) => {
    setEditingAnnouncement(announcement);

    setTitle(announcement.title || "");
    setDescription(
      announcement.description || ""
    );
    setTargetAudience(
      announcement.targetAudience || "All"
    );

    setShowForm(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(
        "Validation",
        "Please enter an announcement title."
      );
      return;
    }

    if (!description.trim()) {
      Alert.alert(
        "Validation",
        "Please enter an announcement description."
      );
      return;
    }

    try {
      setSaving(true);

      const announcementData = {
        title: title.trim(),
        description: description.trim(),
        targetAudience,
      };

      if (editingAnnouncement) {
        await apiClient.put(
          `/announcements/${editingAnnouncement._id}`,
          announcementData
        );

        Alert.alert(
          "Success",
          "Announcement updated successfully."
        );
      } else {
        await apiClient.post(
          "/announcements",
          announcementData
        );

        Alert.alert(
          "Success",
          "Announcement published successfully."
        );
      }

      setShowForm(false);
      setEditingAnnouncement(null);

      await loadAnnouncements();
    } catch (error) {
      console.log(
        "Save announcement error:",
        error.response?.data ||
          error.message
      );

      Alert.alert(
        "Save Failed",
        error.response?.data?.message ||
          "Unable to save announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (announcement) => {
    Alert.alert(
      "Delete Announcement",
      `Are you sure you want to delete "${announcement.title}"?`,
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
                `/announcements/${announcement._id}`
              );

              Alert.alert(
                "Deleted",
                "Announcement deleted successfully."
              );

              await loadAnnouncements();
            } catch (error) {
              console.log(
                "Delete announcement error:",
                error.response?.data ||
                  error.message
              );

              Alert.alert(
                "Delete Failed",
                error.response?.data?.message ||
                  "Unable to delete announcement."
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
            Loading announcements...
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
            Announcements
          </Text>

          <Text style={styles.subtitle}>
            Manage hostel announcements
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
              {editingAnnouncement
                ? "Edit Announcement"
                : "New Announcement"}
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
            Title
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Announcement title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.inputLabel}>
            Description
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
            ]}
            placeholder="Write your announcement..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.inputLabel}>
            Target Audience
          </Text>

          <View style={styles.audienceContainer}>
            {audiences.map((audience) => (
              <TouchableOpacity
                key={audience}
                style={[
                  styles.audienceButton,
                  targetAudience ===
                    audience &&
                    styles.selectedAudience,
                ]}
                onPress={() =>
                  setTargetAudience(
                    audience
                  )
                }
              >
                <Text
                  style={[
                    styles.audienceText,
                    targetAudience ===
                      audience &&
                      styles.selectedAudienceText,
                  ]}
                >
                  {audience}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.publishButton,
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
                style={
                  styles.publishButtonText
                }
              >
                {editingAnnouncement
                  ? "Save Changes"
                  : "Publish Announcement"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* EMPTY */}

      {announcements.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📢
          </Text>

          <Text style={styles.emptyTitle}>
            No Announcements
          </Text>

          <Text style={styles.emptyText}>
            You haven't published any
            announcements yet.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={openAddForm}
          >
            <Text
              style={styles.emptyButtonText}
            >
              + Create Announcement
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        announcements.map((announcement) => (
          <View
            key={announcement._id}
            style={styles.announcementCard}
          >
            <View style={styles.cardTop}>
              <View style={styles.announcementIcon}>
                <Text>📢</Text>
              </View>

              <View style={styles.announcementInfo}>
                <Text
                  style={styles.announcementTitle}
                >
                  {announcement.title}
                </Text>

                <Text style={styles.audienceBadge}>
                  {announcement.targetAudience}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>
              {announcement.description}
            </Text>

            <View style={styles.meta}>
              <Text style={styles.metaText}>
                By{" "}
                {announcement.createdBy
                  ?.fullName ||
                  "Admin"}
              </Text>

              <Text style={styles.metaText}>
                {announcement.createdAt
                  ? new Date(
                      announcement.createdAt
                    ).toLocaleDateString()
                  : ""}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  openEditForm(
                    announcement
                  )
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
                  handleDelete(
                    announcement
                  )
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
  },

  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
  },

  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
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

  descriptionInput: {
    height: 120,
    paddingTop: 14,
  },

  audienceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  audienceButton: {
    borderWidth: 1,
    borderColor: "#D8DCE5",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginRight: 7,
    marginBottom: 7,
  },

  selectedAudience: {
    backgroundColor: "#8B5A2B",
    borderColor: "#8B5A2B",
  },

  audienceText: {
    color: "#555",
    fontWeight: "600",
  },

  selectedAudienceText: {
    color: "#FFF",
  },

  publishButton: {
    marginTop: 18,
    height: 48,
    borderRadius: 11,
    backgroundColor: "#8B5A2B",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  publishButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  announcementCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 17,
    marginBottom: 15,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  announcementIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#F5EDE6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  announcementInfo: {
    flex: 1,
  },

  announcementTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
  },

  audienceBadge: {
    marginTop: 5,
    alignSelf: "flex-start",
    backgroundColor: "#F5EDE6",
    color: "#8B5A2B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "700",
  },

  description: {
    marginTop: 15,
    color: "#555",
    lineHeight: 21,
  },

  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  metaText: {
    color: "#888",
    fontSize: 12,
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
    color: "#222",
  },

  emptyText: {
    marginTop: 7,
    textAlign: "center",
    color: "#777",
    textAlign: "center",
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