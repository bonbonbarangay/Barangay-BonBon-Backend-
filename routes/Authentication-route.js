import { Router } from "express";
import {
  signIn,
  signUp,
  getByUserid,
  updateUser,
  verifyUser,
  verifyOtp,
} from "../controllers/Authentication-controller.js";
const authenticationRoutes = Router();
authenticationRoutes.post("/signup", signUp);
authenticationRoutes.post("/signin", signIn);
authenticationRoutes.post("/verifyotp", verifyOtp);
authenticationRoutes.get("/:id", getByUserid);
authenticationRoutes.put("/:id", updateUser);
authenticationRoutes.put("/verifyaccount/:id", verifyUser);

export default authenticationRoutes;
