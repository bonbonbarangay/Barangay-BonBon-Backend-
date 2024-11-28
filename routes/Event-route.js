import { Router } from "express";
import {
  createEvent,
  getAllEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/Event-controller.js";
const eventRoute = Router();
eventRoute.post("/", createEvent);
eventRoute.get("/", getAllEvent);
eventRoute.put("/:id", updateEvent);
eventRoute.delete("/:id", deleteEvent);

export default eventRoute;
