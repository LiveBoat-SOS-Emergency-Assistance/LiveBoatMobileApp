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
  static async updateProfile(data: any) {
    try {
      const result = await axiosPrivate.put("/user/profile", data, {
        headers: {
          "Content-Type": "application/json",
        },
        requiresAuth: true,
      } as CustomAxiosRequestConfig);
      return result;
    } catch (error: any) {
      console.error("Error when update profile:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });
      // console.error("Update Profile:", error);
    }
  }
}
