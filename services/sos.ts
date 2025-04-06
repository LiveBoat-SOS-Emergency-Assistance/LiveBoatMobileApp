import AsyncStorage from "@react-native-async-storage/async-storage";
import { sos } from "../utils/request";
export class sosService {
  static async sos_create(data: any) {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const result = await sos("/create", {
        method: "POST",
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
  static async sos_edit(sosId: string, data: any) {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const result = await sos(`/update/${sosId}`, {
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
  static async get_status_all() {
    // const token = await AsyncStorage.getItem("accessToken");
    try {
      const result = await sos(`/all`, {
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
}
