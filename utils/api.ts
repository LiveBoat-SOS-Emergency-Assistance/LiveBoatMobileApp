import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { baseURL } from "../baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1. Define custom request config interface
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean;
  _retry?: boolean;
}

// 2. Create a single Axios instance
const axiosPrivate: AxiosInstance = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. Function to get access token from AsyncStorage
const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("accessToken");
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
};

// 4. Request Interceptor: Attach token if requiresAuth is true
axiosPrivate.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const customConfig = config as CustomAxiosRequestConfig;
    // console.log("Request Config:", customConfig);

    if (customConfig.requiresAuth) {
      const accessToken = await getAccessToken();
      // console.log("Access Token:", accessToken);
      if (accessToken && customConfig.headers) {
        customConfig.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    return customConfig;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 5. Response Interceptor: Handle token refresh on 401
axiosPrivate.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<{ accessToken: string }>(
          `${baseURL}/jwt/access-token`,
          {},
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        await AsyncStorage.setItem("accessToken", newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosPrivate;
