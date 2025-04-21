import axiosPrivate, { CustomAxiosRequestConfig } from "../utils/api";

export class rescuerServices {
  static async updateRescuer(data: any) {
    try {
      const result = await axiosPrivate.put(`/sos/rescuer`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async postRescuer(sosId: number, data: any) {
    try {
      const result = await axiosPrivate.post(`/sos/rescuer/${sosId}`, data, {
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
  static async getRescuerBySOSId(sosId: number, status: string) {
    try {
      const result = await axiosPrivate.get(`/sos/rescuers/${sosId}`, {
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
  static async getSOSCurrent() {
    try {
      const result = await axiosPrivate.get("/sos/rescuer/current", {
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
