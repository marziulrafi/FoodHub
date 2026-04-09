import axios from "axios";

export const api = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error || "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);
