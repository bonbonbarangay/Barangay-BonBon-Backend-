import { Router } from "express";
import { notificationForUser } from "../controllers/NotificationEmail-controller.js";
const notificationEmailRoutes = Router();
notificationEmailRoutes.post("/", notificationForUser);
export default notificationEmailRoutes;
