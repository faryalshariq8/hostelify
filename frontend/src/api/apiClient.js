import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//const API_BASE_URL = "http://10.0.2.2:5000/api";

const apiClient = axios.create({
  baseURL: "https://hostelify-production.up.railway.app/api",
});

// Automatically attach JWT token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;