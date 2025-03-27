import axios from "axios";
import { baseURL } from "../baseUrl";

const createAxiosInstance = (servicePath: string) => {
  return axios.create({
    baseURL: `${baseURL}/${servicePath}`,
    responseType: "json",
    withCredentials: true,
  });
};

const authentication = createAxiosInstance("auth");
const email = createAxiosInstance("email");
export { authentication, email };
