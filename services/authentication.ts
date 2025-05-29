import AsyncStorage from "@react-native-async-storage/async-storage";

import axiosPrivate, { CustomAxiosRequestConfig } from "../utils/api";
export class authen {
  static async register(data: any) {
    try {
      const result = await axiosPrivate.post(
        "/auth/complete-register-flow",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async send_otp(data: any) {
    try {
      const result = await axiosPrivate.post("/email/send-otp", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async login(data: any) {
    try {
      const result = await axiosPrivate.post("/auth/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async reset_password(data: any) {
    try {
      const result = await axiosPrivate.post(
        "/auth/reset-password-email",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async logout() {
    try {
      const result = await axiosPrivate.get("/auth/logout", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async change_password(data: any) {
    try {
      const result = await axiosPrivate.put("/auth/change-password", data, {
        headers: {
          "Content-Type": "application/json",
        },
        requiresAuth: true,
      } as CustomAxiosRequestConfig);

      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static reset_send_otp = async (email: string) => {
    try {
      const result = await axiosPrivate.post("/auth/reset-password-otp", {
        email: email,
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  };
  static async verify_otp(data: any) {
    try {
      const result = await axiosPrivate.post(
        "/auth/verify-reset-password-otp",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}
