import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import CustomHeader from "../components/CustomHeader";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPassword from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";

import StudentHome from "../screens/student/StudentHome";
import AdminDashboard from "../screens/admin/AdminDashboard";
import AdminStudentsScreen from "../screens/admin/AdminStudentsScreen";
import AdminHostels from "../screens/admin/AdminHostels";
import AdminRooms from "../screens/admin/AdminRooms";
import AdminApplications from "../screens/admin/AdminApplications";
import AdminComplaints from "../screens/admin/AdminComplaints";
import AdminFees from "../screens/admin/AdminFees";
import AdminAnnouncements from "../screens/admin/AdminAnnouncements";
import AdminReports from "../screens/admin/AdminReports";

import ProfileScreen from "../screens/student/ProfileScreen";
import EditProfileScreen from "../screens/student/EditProfileScreen";
import ChangePasswordScreen from "../screens/student/ChangePasswordScreen";

import ApplicationScreen from "../screens/student/ApplicationScreen";
import AvailableHostelsScreen from "../screens/student/AvailableHostelsScreen";
import RoomAllocationScreen from "../screens/student/RoomAllocationScreen";

import FeeScreen from "../screens/student/FeeScreen";
import PaymentScreen from "../screens/student/PaymentScreen";
import PaymentHistoryScreen from "../screens/student/PaymentHistoryScreen";

import AnnouncementsScreen from "../screens/student/AnnouncementsScreen";
import ComplaintsScreen from "../screens/student/ComplaintsScreen";
import LeaveRequests from "../screens/student/LeaveRequests";
import VisitorRequests from "../screens/student/VisitorRequests";
import RoomTransfer from "../screens/student/RoomTransfer";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F7FB" }}>
        <ActivityIndicator size="large" color="#3867D6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: true,
          header: ({ navigation, route, options }) => (
            <CustomHeader title={options.title || route.name} navigation={navigation} />
          )
        }}
      >
        {!user ? (
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </Stack.Group>
        ) : user.role?.toLowerCase() === "admin" ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: "Admin Dashboard" }} />
            <Stack.Screen name="AdminStudents" component={AdminStudentsScreen} />
            <Stack.Screen name="AdminHostels" component={AdminHostels} options={{ headerShown: true, title: "Manage Hostels" }} />
            <Stack.Screen name="AdminRooms" component={AdminRooms} options={{ headerShown: true, title: "Manage Rooms" }} />
            <Stack.Screen name="AdminApplications" component={AdminApplications} options={{ headerShown: true, title: "Hostel Applications" }} />
            <Stack.Screen name="AdminComplaints" component={AdminComplaints} options={{ headerShown: true, title: "Complaints" }} />
            <Stack.Screen name="AdminFees" component={AdminFees} options={{ headerShown: true, title: "Fee Management" }} />
            <Stack.Screen name="AdminAnnouncements" component={AdminAnnouncements} options={{ headerShown: true, title: "Announcements" }} />
            <Stack.Screen name="AdminReports" component={AdminReports} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="StudentHome" component={StudentHome} options={{ title: "Student Dashboard" }} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="Application" component={ApplicationScreen} />
            <Stack.Screen name="AvailableHostels" component={AvailableHostelsScreen} options={{ title: "Available Hostels" }} />
            <Stack.Screen name="RoomAllocation" component={RoomAllocationScreen} />
            <Stack.Screen name="Fee" component={FeeScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
            <Stack.Screen name="Complaints" component={ComplaintsScreen} />
            <Stack.Screen name="LeaveRequests" component={LeaveRequests} />
            <Stack.Screen name="VisitorRequests" component={VisitorRequests} />
            <Stack.Screen name="RoomTransfer" component={RoomTransfer} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
