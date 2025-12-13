import axios from "axios";

const api = axios.create({
  baseURL: "https://auction-backend-v4ox.onrender.com/api/v1",
  withCredentials: true,   // ⭐ THIS IS THE FIX
});

export default api;
