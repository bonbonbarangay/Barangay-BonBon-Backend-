import { Router } from "express";
import { signIn, signUp } from "../controllers/Authentication-controller.js";
const authenticationRoutes = Router();
authenticationRoutes.post("/signup", signUp);
authenticationRoutes.post("/signin", signIn);
export default authenticationRoutes;
