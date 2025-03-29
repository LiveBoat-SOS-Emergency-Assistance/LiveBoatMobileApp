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
}
