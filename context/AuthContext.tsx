import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authen } from "../services/authentication";
import { router, SplashScreen } from "expo-router";
import { userServices } from "../services/user";
import { Profile } from "../types/Profile";
import { groupServices } from "../services/group";
import LoadingScreen from "../components/Loading/LoadingScreen";

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
  loading: boolean;
  accessToken: string | null;
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
    const initializeAuth = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Load access token
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          setAccessToken(token);

          // Load profile
          const profileString = await AsyncStorage.getItem("profile");
          if (profileString) {
            const profileData: Profile = JSON.parse(profileString);
            setProfile(profileData);
          }

          // Load group IDs
          const groupIdsString = await AsyncStorage.getItem("groupIds");
          if (groupIdsString) {
            const groupIdsData: number[] = JSON.parse(groupIdsString);
            setGroupIds(groupIdsData);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);
  useEffect(() => {
    const checkAccessToken = async () => {
      if (!loading) {
        SplashScreen.hide();
        if (accessToken) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/");
        }
      }
    };
    checkAccessToken();
  }, [loading, accessToken]);

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
      // setLoading(true); 
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
          );
          await AsyncStorage.setItem("groupIds", JSON.stringify(ids));
          setGroupIds(ids);
          setProfile(profileRes.data);
          await AsyncStorage.setItem(
            "profile",
            JSON.stringify(profileRes.data)
          );
        }
        setAccessToken(result.data?.accessToken);
        // return;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      // setLoading(false);
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
      // setLoading(true);
      const result = await authen.logout();
      if (result) {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("profile");
        await AsyncStorage.removeItem("groupIds");
        setAccessToken(null);
        setUser(null);
        setProfile(null);
        setGroupIds([]);
        return;
      }
    } catch (error: any) {
      throw error;
    } finally {
      // setLoading(false); 
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
        accessToken,
        loading,
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
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
