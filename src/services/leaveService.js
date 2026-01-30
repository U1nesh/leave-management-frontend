import axios from "axios";
import { getToken } from "../utils/auth";

const API = "http://localhost:5000/api/leaves";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getAllLeaves = () =>
  axios.get(`${API}/all`, authHeader());

export const getStudentLeaves = () =>
  axios.get(`${API}/student`, authHeader());

export const deleteLeave = (id) =>
  axios.delete(`${API}/delete/${id}`, authHeader());
