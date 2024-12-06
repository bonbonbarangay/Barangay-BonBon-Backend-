import { Router } from "express";
import {
  createLocation,
  getAllLocations,
  updateLocation,
  deleteLocation,
  updateLocationDrag,
} from "../controllers/Map-controller.js";
const mapRoutes = Router();
mapRoutes.post("/", createLocation);
mapRoutes.get("/", getAllLocations);
mapRoutes.put("/:id", updateLocation);
mapRoutes.put("/draglocation/:id", updateLocationDrag);

mapRoutes.delete("/:id", deleteLocation);

export default mapRoutes;
