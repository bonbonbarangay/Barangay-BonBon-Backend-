import { Router } from "express";
import {
  createOfficial,
  getAllOfficials,
  updateOfficial,
  deleteOfficial,
  getOfficialByPositionType,
} from "../controllers/Official-controller.js";
const officialsRoutes = Router();

officialsRoutes.post("/", createOfficial);
officialsRoutes.post("/position", getOfficialByPositionType);
officialsRoutes.get("/", getAllOfficials);
officialsRoutes.put("/:id", updateOfficial);
officialsRoutes.delete("/:id", deleteOfficial);

export default officialsRoutes;
