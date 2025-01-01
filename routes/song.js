import { Router } from "express";
import { 
    songByIdController, 
    songByNameController 
} from "../controllers/song.js";

const router = Router();

router.get("/:id", songByIdController);

router.get("/songList/:song", songByNameController);

export default router;