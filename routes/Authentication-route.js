import { Router } from "express";
import {
  signIn,
  signUp,
  getByUserid,
  updateUser,
  verifyUser,
  verifyOtp,
  getEmailAndgetOtp,
  resetPassword,
} from "../controllers/Authentication-controller.js";
const authenticationRoutes = Router();
authenticationRoutes.post("/signup", signUp);
authenticationRoutes.post("/signin", signIn);
authenticationRoutes.post("/verifyotp", verifyOtp);
authenticationRoutes.post("/forgotpasssword", getEmailAndgetOtp);
authenticationRoutes.get("/:id", getByUserid);
authenticationRoutes.put("/:id", updateUser);
authenticationRoutes.put("/resetpassword/:id", resetPassword);

authenticationRoutes.put("/verifyaccount/:id", verifyUser);

export default authenticationRoutes;
