import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import apiClient from "../../api/apiClient";
import GlassBackground from "../../components/GlassBackground";


export default function AnnouncementsScreen({ navigation }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);


  const loadAnnouncements = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/announcements");

      setAnnouncements(response.data);
    } catch (error) {
      console.log(
        "Announcements error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Announcements Error",
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


  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };


  if (loading) {
    return (
      <GlassBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5A2B" />

          <Text style={styles.loadingText}>
            Loading announcements...
          </Text>
        </View>
      </GlassBackground>
    );
  }


  return (
    <GlassBackground>
      <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            📢 Announcements
          </Text>

          <Text style={styles.headerSubtitle}>
            Stay updated with hostel news
          </Text>
        </View>
      </View>


      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {announcements.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📭</Text>

            <Text style={styles.emptyTitle}>
              No Announcements
            </Text>

            <Text style={styles.emptyText}>
              There are currently no announcements available.
            </Text>
          </View>
        ) : (
          announcements.map((announcement) => (
            <View
              key={announcement._id}
              style={styles.card}
            >

              {/* Card Header */}
              <View style={styles.cardHeader}>

                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>
                    📢
                  </Text>
                </View>

                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    {announcement.title}
                  </Text>

                  <Text style={styles.date}>
                    {formatDate(announcement.createdAt)}
                  </Text>
                </View>

              </View>


              {/* Audience */}
              <View style={styles.audienceBadge}>
                <Text style={styles.audienceText}>
                  {announcement.targetAudience === "All"
                    ? "Everyone"
                    : announcement.targetAudience}
                </Text>
              </View>


              {/* Description */}
              <Text style={styles.description}>
                {announcement.description}
              </Text>


              {/* Posted By */}
              {announcement.createdBy?.fullName && (
                <View style={styles.footer}>
                  <Text style={styles.postedBy}>
                    Posted by {announcement.createdBy.fullName}
                  </Text>
                </View>
              )}

            </View>
          ))
        )}

      </ScrollView>
    </View>
    </GlassBackground>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "transparent",
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
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#8B5A2B",
    flexDirection: "row",
    alignItems: "center",
  },


  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },


  backText: {
    color: "#FFF",
    fontSize: 30,
    lineHeight: 32,
  },


  headerTextContainer: {
    flex: 1,
  },


  headerTitle: {
    color: "#FFF",
    fontSize: 25,
    fontWeight: "800",
  },


  headerSubtitle: {
    color: "#DCE6FF",
    fontSize: 14,
    marginTop: 4,
  },


  content: {
    padding: 20,
    paddingBottom: 40,
  },


  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },


  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },


  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F5EDE6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },


  icon: {
    fontSize: 25,
  },


  titleContainer: {
    flex: 1,
  },


  title: {
    fontSize: 19,
    fontWeight: "800",
    color: "#202020",
  },


  date: {
    marginTop: 5,
    fontSize: 13,
    color: "#777",
  },


  audienceBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 18,
    marginBottom: 14,
  },


  audienceText: {
    color: "#8B5A2B",
    fontSize: 12,
    fontWeight: "700",
  },


  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },


  footer: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    marginTop: 18,
    paddingTop: 12,
  },


  postedBy: {
    fontSize: 13,
    color: "#888",
  },


  emptyCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    marginTop: 20,
  },


  emptyIcon: {
    fontSize: 45,
    marginBottom: 15,
  },


  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 8,
  },


  emptyText: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
  },

});