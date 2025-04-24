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
  static async getMemberByIdGroup(squadId: number) {
    try {
      const result = await axiosPrivate.get(`/group/members/${squadId}`, {
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
  static async inviteMember(squadId: number, data: any) {
    try {
      const result = await axiosPrivate.post(`/group/invite/${squadId}`, data, {
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
  static async updateInvite(squadId: number, data: any) {
    try {
      const result = await axiosPrivate.put(`/group/invite/${squadId}`, data, {
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
  static async getInvites() {
    try {
      const result = await axiosPrivate.get(`/group/invitations`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async updateGroups(squadId: number, data: any) {
    try {
      const result = await axiosPrivate.put(`/group/update/${squadId}`, data, {
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
  static async deleteGroup(squadId: number) {
    try {
      const result = await axiosPrivate.delete(`/group/delete/${squadId}`, {
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
  static async leaveGroup(squadId: number) {
    try {
      const result = await axiosPrivate.post(`/group/leave/${squadId}`, {
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

  // Kick member from group
  static async kickGroup(squadId: number, data: any) {
    try {
      const result = await axiosPrivate.post(`/group/kick/${squadId}`, data, {
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
