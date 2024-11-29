import { Router } from "express";
import {
  createHousehold,
  getAllHousehold,
} from "../controllers/Household-controllers.js";
const householdRoutes = Router();
householdRoutes.post("/", createHousehold);
householdRoutes.get("/", getAllHousehold);

export default householdRoutes;
