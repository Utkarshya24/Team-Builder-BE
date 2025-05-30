import { Router } from 'express';
const router = Router();
import { CreateTeam, uploadCSV } from '../controllers/teamController.js';
import { acceptTeamInvite, isValidToken } from '../controllers/inviteController.js';
import authMiddleware from '../middleware/authMiddleware.js';


router.post('/create', authMiddleware, uploadCSV, CreateTeam); 
router.get('/isValidToken', authMiddleware, isValidToken);
router.get("/accept", authMiddleware, acceptTeamInvite);

export default router;