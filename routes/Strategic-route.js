import { Router } from "express";
import {
  createStrategic,
  getAllStrategic,
  deletePolyLineById,
} from "../controllers/Strategic-controller.js";
const strategicRoutes = Router();
strategicRoutes.post("/", createStrategic);
strategicRoutes.get("/", getAllStrategic);

strategicRoutes.delete("/:id", deletePolyLineById);

export default strategicRoutes;
