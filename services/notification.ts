import axiosPrivate, { CustomAxiosRequestConfig } from "../utils/api";
export class notifcationService {
  // static async create_notification(data: any) {
  //   try {
  //     const result = await axiosPrivate.post("/notification/create", data, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       requiresAuth: true,
  //     } as CustomAxiosRequestConfig);
  //     return result;
  //   } catch (error: any) {
  //     throw error;
  //   }
  // }
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
  static async push_notification(data: any) {
    try {
      const result = await axiosPrivate.post(
        "/notification/send-push-notification",
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
  static async push_app_notification(data: any) {
    try {
      const result = await axiosPrivate.post(
        "/notification/send-in-app-notification",
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
  static async send_notification(data: any, inapp: boolean, push: boolean) {
    try {
      const result = await axiosPrivate.post("/notification/send", data, {
        params: {
          inapp: inapp,
          push: push,
        },
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
}
