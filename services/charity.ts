import axiosPrivate, { CustomAxiosRequestConfig } from "../utils/api";
export class charityServices {
  static async get_all_charity(limit: number, offset: number, status: string) {
    try {
      const result = await axiosPrivate.get("/charity/all", {
        params: {
          limit: limit,
          offset: offset,
          status: "ACTIVE",
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
  static async get_total_charity_count() {
    try {
      const result = await axiosPrivate.get("/charity/total-donation", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  static async get_charity_by_id(charityId: number) {
    try {
      const result = await axiosPrivate.get(`/charity/${charityId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async get_all_charity_record_by_charityID(
    charityId: number,
    limit: number,
    offset: number
  ) {
    try {
      const result = await axiosPrivate.get(`charity-record/all/${charityId}`, {
        params: {
          limit: limit,
          offset: offset,
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
  static async get_charity_record_by_recordID(charityId: number) {
    try {
      const result = await axiosPrivate.get(`charity-record/${charityId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  //   Donation
  static async create_donation(data: any) {
    try {
      const result = await axiosPrivate.post("/charity-donation/create", data, {
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
  static async get_all_donation_by_charityID(
    charityId?: number,
    status?: string,
    phone?: string,
    limit?: number,
    offset?: number
  ) {
    try {
      const params: any = {};
      if (charityId !== undefined) params.charityId = charityId;
      if (status !== undefined) params.status = status;
      if (phone !== undefined && phone.trim() !== "") params.phone = phone;
      if (limit !== undefined) params.limit = limit;
      if (offset !== undefined) params.offset = offset;

      const result = await axiosPrivate.get("/charity-donation/all", {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async search_donations_by_phone(
    phone: string,
    charityId?: number,
    status: string = "SUCCESS",
    limit?: number,
    offset?: number
  ) {
    try {
      const params: any = {
        status,
        sort: "amount:desc",
      };

      if (charityId !== undefined) params.charityId = charityId;
      if (phone && phone.trim() !== "") params.phone = phone;
      if (limit !== undefined) params.limit = limit;
      if (offset !== undefined) params.offset = offset;

      const result = await axiosPrivate.get("/charity-donation/all", {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    } catch (error: any) {
      throw error;
    }
  }
  static async get_all_donation(status: string) {
    try {
      const result = await axiosPrivate.get("/charity-donation/user/all", {
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
  static async post_donation(data: any) {
    try {
      const result = await axiosPrivate.post(
        "/charity-donation/webhook/payos",
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
