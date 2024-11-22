import { Router } from "express";
import {
  createAnnoucement,
  getAllAnnouncement,
  updateAnnoucement,
} from "../controllers/Announcement-controller.js";

const AnnouncementRoutes = Router();
AnnouncementRoutes.post("/", createAnnoucement); // POST METHOD CREATE USER
AnnouncementRoutes.get("/", getAllAnnouncement);
AnnouncementRoutes.put("/:id", updateAnnoucement);

export default AnnouncementRoutes;
