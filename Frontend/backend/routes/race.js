import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getTracks,
  getCars,
  buyCar,
  selectCar,
  getMyCars,
  completeRace,
  getLeaderboard,
  getRaceHistory,
} from '../controllers/raceController.js';

const router = express.Router();

router.get('/tracks', protect, getTracks);
router.get('/cars', protect, getCars);
router.post('/buy-car', protect, buyCar);
router.post('/select-car', protect, selectCar);
router.get('/my-cars', protect, getMyCars);
router.post('/complete', protect, completeRace);
router.get('/leaderboard/:trackId', protect, getLeaderboard);
router.get('/history', protect, getRaceHistory);

export default router;



