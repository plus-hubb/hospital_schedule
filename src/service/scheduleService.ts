import axios from "axios";

export const getSchedules = async () => {
  const res = await axios.get("http://localhost:3000/schedule");
  return res.data;
};