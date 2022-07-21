import Axios from "axios";
import toast from "react-hot-toast";

export const axios = Axios.create();

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;

    toast.error(message);

    return Promise.reject(error);
  }
);
