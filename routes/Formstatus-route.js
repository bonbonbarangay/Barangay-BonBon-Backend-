import { Router } from "express";
import {
  createFormStatus,
  getByUserid,
  updateUserForm,
  deleteFormStatus,
} from "../controllers/Formstatus-controller.js";
const formStatusRoute = Router();
formStatusRoute.get("/:userid", getByUserid);
formStatusRoute.post("/", createFormStatus);
formStatusRoute.put("/:userid", updateUserForm);
formStatusRoute.delete("/:userid", deleteFormStatus);

export default formStatusRoute;
