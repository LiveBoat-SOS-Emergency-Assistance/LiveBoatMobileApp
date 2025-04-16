import axiosPrivate, { CustomAxiosRequestConfig } from "../utils/api";

export class userServices {
  static async getUserByID(userId: number) {
    try {
      const result = await axiosPrivate.get(`/user/profile/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async updateImage(data: any) {
    try {
      const result = await axiosPrivate.put("/user/update-avatar", data, {
        headers: {
          "Content-Type": "application/json",
        },
        requiresAuth: true,
      } as CustomAxiosRequestConfig);

      return result;
    } catch (error: any) {
      console.error("Update Image:", error);
    }
  }
}
