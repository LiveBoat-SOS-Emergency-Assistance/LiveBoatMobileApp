import axiosPrivate from "../utils/api";

export class rescuerServices {
  static async updateRescuer(sosId: number, data: any) {
    try {
      const result = await axiosPrivate.put(
        `/sos/rescuer/profile/${sosId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async postRescuer(sosId: number, data: any) {
    try {
      const result = await axiosPrivate.post(
        `/sos/rescuer/profile/${sosId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}
