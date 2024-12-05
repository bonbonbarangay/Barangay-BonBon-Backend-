import { Router } from "express";
import {
  signIn,
  signUp,
  getByUserid,
  updateUser,
} from "../controllers/Authentication-controller.js";
const authenticationRoutes = Router();
authenticationRoutes.post("/signup", signUp);
authenticationRoutes.post("/signin", signIn);
authenticationRoutes.get("/:id", getByUserid);
authenticationRoutes.put("/:id", updateUser);

export default authenticationRoutes;
