import AsyncStorage from "@react-native-async-storage/async-storage";

import axiosPrivate, { CustomAxiosRequestConfig } from "../utils/api";
export class groupServices {
  static async createGroup(data: any) {
    try {
      const result = await axiosPrivate.post("/group/create", data, {
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
  static async getGroup() {
    try {
      const result = await axiosPrivate.get("/group/user-groups", {
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
}
