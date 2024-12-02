import { Router } from "express";
import {
  signIn,
  signUp,
  getByUserid,
  updatePassword,
} from "../controllers/Authentication-controller.js";
const authenticationRoutes = Router();
authenticationRoutes.post("/signup", signUp);
authenticationRoutes.post("/signin", signIn);
authenticationRoutes.get("/:id", getByUserid);
authenticationRoutes.put("/:id", updatePassword);

export default authenticationRoutes;
