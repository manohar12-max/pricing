
import axios from "axios";

const API = axios.create({
  baseURL: "https://pricing-rwt1.onrender.com/api/pricing", 
});

export default API;
