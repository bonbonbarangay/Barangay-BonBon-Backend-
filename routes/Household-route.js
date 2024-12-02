import { Router } from "express";
import {
  createHousehold,
  getAllHousehold,
  acceptPending,
  findById,
  getByUserid,
  deleteHouseHoldAndHouseMembers,
} from "../controllers/Household-controllers.js";
const householdRoutes = Router();
householdRoutes.post("/", createHousehold);
householdRoutes.get("/", getAllHousehold);
householdRoutes.get("/:userid", findById);
householdRoutes.get("/user/:userid", getByUserid);

householdRoutes.put("/:id", acceptPending);
householdRoutes.delete("/:userid", deleteHouseHoldAndHouseMembers);

export default householdRoutes;
