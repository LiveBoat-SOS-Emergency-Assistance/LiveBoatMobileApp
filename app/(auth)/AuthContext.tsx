import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authen } from "../../services/authentication";
import { jwtServices } from "../../services/jwt";

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
    // const loadUser = async () => {
    //   try {
    //     const storedUser = await AsyncStorage.getItem("user");
    //     if (storedUser) {
    //       setUser(JSON.parse(storedUser));
    //     }
    //   } catch (error) {
    //     console.error("Error loading user:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // loadUser();
  }, []);

  const get_access_token = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) return null;
      const result = await jwtServices.getAccessToken({ refreshToken });
      if (result && result.data?.accessToken) {
        const newAccessToken = result.data?.accessToken;
        setAccessToken(newAccessToken);
        await AsyncStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
      }
      return null;
    } catch (error: any) {
      throw error;
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
    console.log("Logout user");
    await AsyncStorage.removeItem("user");
    setUser(null);
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
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
