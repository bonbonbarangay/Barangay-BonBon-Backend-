import { Router } from "express";
import {
  createHousehold,
  getAllHousehold,
  acceptPending,
  findById,
  deleteHouseHoldAndHouseMembers,
} from "../controllers/Household-controllers.js";
const householdRoutes = Router();
householdRoutes.post("/", createHousehold);
householdRoutes.get("/", getAllHousehold);
householdRoutes.get("/:userid", findById);
householdRoutes.put("/:id", acceptPending);
householdRoutes.delete("/:userid", deleteHouseHoldAndHouseMembers);

export default householdRoutes;
