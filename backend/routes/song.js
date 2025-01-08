import { Router } from "express";
import { 
    songByIdController, 
    songByNameController 
} from "../controllers/song.js";
import authMiddleware from "../middlewares/authentication.js";

const router = Router();

router.get("/:id", authMiddleware, songByIdController);

router.get("/songList/:song", songByNameController);

export default router;