import { Router } from "express";
import {
  createFormStatus,
  getByUserid,
  updateUserForm,
} from "../controllers/Formstatus-controller.js";
const formStatusRoute = Router();
formStatusRoute.get("/:userid", getByUserid);
formStatusRoute.post("/", createFormStatus);
formStatusRoute.put("/:userid", updateUserForm);

export default formStatusRoute;
