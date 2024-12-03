import { Router } from "express";
import {
  createLocation,
  getAllLocations,
  updateLocation,
  deleteLocation,
} from "../controllers/Map-controller.js";
const mapRoutes = Router();
mapRoutes.post("/", createLocation);
mapRoutes.get("/", getAllLocations);
mapRoutes.put("/:id", updateLocation);
mapRoutes.delete("/:id", deleteLocation);

export default mapRoutes;
