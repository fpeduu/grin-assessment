import { Router } from 'express';
import { getDashboardData, getPatientSentiment } from '../controllers/dashboard.controller';

const router = Router();

router.get('/', getDashboardData);
router.get('/sentiment/patients', getPatientSentiment);

export default router;
