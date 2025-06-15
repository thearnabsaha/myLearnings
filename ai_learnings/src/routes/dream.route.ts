import { Router } from "express";
import { InterpetationByPsychologists } from "../controllers/interpret.controller";

const router = Router();

router.get("/", InterpetationByPsychologists);
router.get("/:id", InterpetationByPsychologists);
router.put("/:id", InterpetationByPsychologists);
router.delete("/:id", InterpetationByPsychologists);
router.delete("/", InterpetationByPsychologists);
router.get("/?tag=arnab", InterpetationByPsychologists);

export default router;