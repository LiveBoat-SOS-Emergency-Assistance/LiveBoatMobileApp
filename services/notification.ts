import axiosPrivate, { CustomAxiosRequestConfig } from "../utils/api";
export class notifcationService {
  static async get_notification() {
    try {
      const result = await axiosPrivate.get("/notification/list", {
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

  static async create_notification(data: any) {
    try {
      const result = await axiosPrivate.post("/notification/sos", data, {
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
  static async update_fcm_token(data: any) {
    try {
      const result = await axiosPrivate.put(
        "/notification/update-fcm-token",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          requiresAuth: true,
        } as CustomAxiosRequestConfig
      );
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}
