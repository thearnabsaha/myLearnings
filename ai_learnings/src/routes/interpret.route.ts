import { Router } from "express";
import { InterpetationByPsychologists } from "../controllers/interpret.controller";

const router = Router();

router.post("/", InterpetationByPsychologists);

export default router;