
import axios from "axios";
// https://pricing-rwt1.onrender.com/api/pricing
// http://localhost:5000/api/pricing
const API = axios.create({
  baseURL: "https://pricing-rwt1.onrender.com/api/pricing", 
});

export default API;
