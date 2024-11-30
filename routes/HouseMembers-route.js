import { Router } from "express";
import {
  createHouseMembers,
  getAllHouseMembers,
} from "../controllers/HouseMembers-controller.js";
const houseMembers = Router();
houseMembers.post("/", createHouseMembers);
houseMembers.get("/", getAllHouseMembers);

export default houseMembers;
