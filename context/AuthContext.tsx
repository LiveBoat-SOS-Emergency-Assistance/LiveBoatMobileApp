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
import { userServices } from "../services/user";
import { Profile } from "../types/Profile";
import { groupServices } from "../services/group";
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
  change_password: (data: any) => Promise<void>;
  profile: Profile | null;
  groupIds: number[];
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [groupIds, setGroupIds] = useState<number[]>([]);
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
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileString = await AsyncStorage.getItem("profile");
        if (profileString) {
          const profileData: Profile = JSON.parse(profileString);
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);
  useEffect(() => {
    const loadGroupIds = async () => {
      try {
        const groupIdsString = await AsyncStorage.getItem("groupIds");
        if (groupIdsString) {
          const groupIdsData: number[] = JSON.parse(groupIdsString);
          setGroupIds(groupIdsData);
        }
      } catch (error) {
        console.error("Error loading group IDs:", error);
      }
    };

    loadGroupIds();
  }, []);

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
        const userId = result.data.userId;
        if (userId) {
          const profileRes = await userServices.getUserByID(userId);
          const groupIds = await groupServices.getGroup();
          console.log("Group data", groupIds.data);
          const ids = groupIds.data.map((group: { id: string | number }) =>
            Number(group.id)
          ); // Convert to numbers
          await AsyncStorage.setItem("groupIds", JSON.stringify(ids)); // Store as a stringified array of numbers
          setGroupIds(ids);
          setProfile(profileRes.data);
          await AsyncStorage.setItem(
            "profile",
            JSON.stringify(profileRes.data)
          );
        }
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
        login,
        logout,
        change_password,
        profile,
        groupIds,
        setProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
