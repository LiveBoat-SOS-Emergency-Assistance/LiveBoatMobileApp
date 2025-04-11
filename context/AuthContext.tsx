import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authen } from "../services/authentication";
// import { jwtServices } from "../services/jwt";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import axiosPrivate from "../utils/api";
interface RegisterData {
  phone: string;
  password: string;
  email: string;
  code: string;
}

interface SendOtpData {
  email: string;
}

interface LoginData {
  phone: string;
  password: string;
}

type AuthProps = {
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  send_otp: (data: SendOtpData) => Promise<void>;
  reset_password: (data: any) => Promise<void>;
  get_access_token: () => Promise<string | null>;
  change_password: (data: any) => Promise<void>;
};

export const AuthContext = createContext<AuthProps | undefined>(undefined);
interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccessToken = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          setAccessToken(token);
        }
      } catch (error) {
        console.error("Error loading access token:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAccessToken();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (accessToken) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/");
      }
    }
  }, [loading, accessToken]);

  const get_access_token = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        const decoded: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        // Check if the token is still valid
        if (decoded.exp > currentTime) {
          return token;
        }
      }

      // If the token is expired, refresh it
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.log("No refresh token found, logging out...");
        await logout();
        return null;
      }

      // Call the refresh token endpoint
      const refreshResponse = await axiosPrivate.post("/jwt/access-token", {
        refreshToken,
      });

      if (refreshResponse.data?.accessToken) {
        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);
        await AsyncStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
      } else {
        console.log("Failed to refresh token, logging out...");
        await logout();
        return null;
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      await logout();
      return null;
    }
  };
  const register = async (data: RegisterData) => {
    try {
      await authen.register(data);
    } catch (error: any) {
      throw error;
    }
  };
  const send_otp = async (data: SendOtpData) => {
    try {
      await authen.send_otp(data);
    } catch (error: any) {
      throw error;
    }
  };
  const login = async (userData: LoginData) => {
    try {
      const result = await authen.login(userData);
      if (result) {
        await AsyncStorage.setItem("accessToken", result.data?.accessToken);
        await AsyncStorage.setItem("refreshToken", result.data?.refreshToken);
        const newAccessToken = await get_access_token();
        setAccessToken(newAccessToken);
        return;
      }
    } catch (error: any) {
      throw error;
    }
  };
  const reset_password = async (data: any) => {
    try {
      const result = await authen.reset_password(data);
      if (result && (result.data === 200 || result.data === 201)) {
        return;
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const result = await authen.logout();
      if (result) {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        await AsyncStorage.removeItem("user");
        setAccessToken(null);
        setUser(null);
        return;
      }
    } catch (error: any) {
      throw error;
    }
  };

  const change_password = async (data: RegisterData) => {
    try {
      await authen.change_password(data);
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        send_otp,
        reset_password,
        get_access_token,
        login,
        logout,
        change_password,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
