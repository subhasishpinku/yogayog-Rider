import { create } from 'axios';

const axiosInstance = create({
  baseURL: "https://courier.yogayog.net/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
