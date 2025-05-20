import axiosPrivate, { CustomAxiosRequestConfig } from "../utils/api";
export class liveStreamService {
  static async update_livestream_status(data: any) {
    try {
      const result = await axiosPrivate.put(
        "/livestream/update-livestream-status",
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
