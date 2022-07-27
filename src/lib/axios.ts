import { tooManyRequestOff, tooManyRequestOn } from "@/slices/me-api-status";
import store from "@/stores/store";
import Axios from "axios";
import toast from "react-hot-toast";

export const axios = Axios.create();

axios.interceptors.response.use(
  (response) => {
    // Turn off too many requests error
    store.dispatch(tooManyRequestOff());

    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;

    // Toast error message if not exceed limits
    // We are handling 429 in other place
    if (error.response.status !== 429) toast.error(message);

    if (error.response.status === 429) {
      store.dispatch(tooManyRequestOn());
    }

    return Promise.reject(error);
  }
);
