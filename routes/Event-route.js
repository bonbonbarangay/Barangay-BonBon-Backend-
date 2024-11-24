import { Router } from "express";
import {
  createEvent,
  getAllEvent,
  updateEvent,
} from "../controllers/Event-controller.js";
const eventRoute = Router();
eventRoute.post("/", createEvent);
eventRoute.get("/", getAllEvent);
eventRoute.put("/:id", updateEvent);

export default eventRoute;
