import AsyncStorage from "@react-native-async-storage/async-storage";
import { authentication, email } from "../utils/request";

export class authen {
  static async register(data: any) {
    try {
      const result = await authentication("/complete-register-flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async send_otp(data: any) {
    try {
      const result = await email("/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async login(data: any) {
    try {
      const result = await authentication("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async reset_password(data: any) {
    try {
      const result = await authentication("/reset-password-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async logout() {
    try {
      const result = await authentication("/logout", {
        method: "GET",
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
    const token = await AsyncStorage.getItem("accessToken");

    try {
      const result = await authentication("/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(data),
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}
