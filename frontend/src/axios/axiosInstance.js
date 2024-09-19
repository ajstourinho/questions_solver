import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_ENV === "production"
  ? "/api/" : "http://localhost:5000/api/";

const axiosInstance = axios.create({  
  baseURL: BASE_URL,
  // timeout: 5000000,
  headers: { "X-Custom-Header": "foobar" },
});

export default axiosInstance;
