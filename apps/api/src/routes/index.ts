import { Router} from "express";
import { apiError } from "../utils/apiError";
import authrouter from "./authRoute";

const router = Router();

// Register all routers
router.use(authrouter) // Routes for authentication

// Handle invalid routes
router.use(() => {
    throw new apiError("Route not found", 404)
});

export default router;