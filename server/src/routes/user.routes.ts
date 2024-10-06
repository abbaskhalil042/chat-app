import express from "express";
import { login, logout, signup } from "../controllers/user.controller";
// import { signup } from "../controllers/user.controller";

const router=express.Router();


router.post("/signup",signup as any)  
router.post("/login",login as any)
router.post("/logout",logout as any)


export default router