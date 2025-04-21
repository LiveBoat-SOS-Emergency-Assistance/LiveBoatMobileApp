import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosPrivate, { CustomAxiosRequestConfig } from "../utils/api";
export class sosService {
  static async sos_create(data: any) {
    try {
      const result = await axiosPrivate.post("/sos/create", data, {
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
  static async sos_edit(sosId: string, data: any) {
    try {
      const result = await axiosPrivate.put(`/sos/update/${sosId}`, data, {
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
  static async getSOSAll() {
    try {
      const result = await axiosPrivate.get(`/sos/all`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async getSOSById(id: number) {
    try {
      const result = await axiosPrivate.get(`/sos/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async getSOSByStatus(status: string) {
    try {
      const result = await axiosPrivate.get(`/sos/all?status=${status}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
 
  static async getMySOSCurrent() {
    try {
      const result = await axiosPrivate.get("/sos/current", {
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
  static async updateSOS(userId: number, data: any) {
    try {
      const result = await axiosPrivate.put(`/sos/update/${userId}`, data, {
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
