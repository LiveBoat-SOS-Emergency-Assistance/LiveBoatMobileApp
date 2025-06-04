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
  static async getSOSByStatus(
    status: string,
    // limit: number = 10,
    // offset: number = 0,
    filters?: {
      no_rescuers?: boolean;
      has_rescuers?: boolean;
      near_me?: boolean;
      latitude?: number;
      longitude?: number;
      search?: string;
    }
  ) {
    try {
      const params: any = {
        status: status,
        // limit: limit,
        // offset: offset,
      };

      // Add filter parameters if provided
      if (filters) {
        if (filters.no_rescuers !== undefined) {
          params.no_rescuers = filters.no_rescuers;
        }
        if (filters.has_rescuers !== undefined) {
          params.has_rescuers = filters.has_rescuers;
        }
        if (filters.near_me !== undefined) {
          params.near_me = filters.near_me;
        }
        if (filters.latitude !== undefined) {
          params.latitude = filters.latitude;
        }
        if (filters.longitude !== undefined) {
          params.longitude = filters.longitude;
        }
        if (filters.search && filters.search.trim()) {
          params.search = filters.search.trim();
        }
      }
      console.log("params", params);
      const result = await axiosPrivate.get(`/sos/all`, {
        params: params,
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
  static async getGroupBySOSID(sosId: number) {
    try {
      const result = await axiosPrivate.get(`/sos/group/${sosId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async getSOSByUserId(userId: number, status?: string) {
    try {
      const result = await axiosPrivate.get(`/sos/user/${userId}`, {
        params: {
          status: status,
        },
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
