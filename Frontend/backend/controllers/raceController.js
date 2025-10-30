import Race from '../models/Race.js';
import User from '../models/User.js';
import Car from '../models/Car.js';
import UserCar from '../models/UserCar.js';
import { TRACKS } from '../game/trackData.js';

export const getTracks = async (req, res) => {
  try {
    res.status(200).json({ success: true, tracks: Object.values(TRACKS) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCars = async (req, res) => {
  try {
    const allCars = await Car.find().lean();
    const userCars = await UserCar.find({ userId: req.user.id }).lean();

    const carsWithStatus = allCars.map((car) => {
      const owned = userCars.find((uc) => uc.carId.toString() === car._id.toString());
      return {
        ...car,
        isOwned: !!owned,
        isSelected: owned?.isSelected || false,
      };
    });

    res.status(200).json({ success: true, cars: carsWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const buyCar = async (req, res) => {
  try {
    const { carId } = req.body;
    const user = await User.findById(req.user.id);
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    const existing = await UserCar.findOne({ userId: user._id, carId: car._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already own this car' });
    }

    if (user.coinBalance < car.price) {
      return res.status(400).json({ success: false, message: 'Insufficient coins' });
    }

    await user.subtractCoins(car.price);

    await UserCar.create({ userId: user._id, carId: car._id, isOwned: true, isSelected: false });

    res.status(200).json({ success: true, message: 'Car purchased successfully', newBalance: user.coinBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const selectCar = async (req, res) => {
  try {
    const { carId } = req.body;

    await UserCar.updateMany({ userId: req.user.id }, { isSelected: false });

    const updated = await UserCar.findOneAndUpdate(
      { userId: req.user.id, carId },
      { isSelected: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Car not owned' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyCars = async (req, res) => {
  try {
    const userCars = await UserCar.find({ userId: req.user.id }).populate('carId').lean();
    res.status(200).json({ success: true, cars: userCars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const completeRace = async (req, res) => {
  try {
    const { trackId, position, lapTimes, totalTime, carId } = req.body;

    if (!TRACKS[trackId]) {
      return res.status(400).json({ success: false, message: 'Invalid track' });
    }

    if (position < 1 || position > 5) {
      return res.status(400).json({ success: false, message: 'Invalid position' });
    }

    const coinRewards = { 1: 10, 2: 5, 3: 2 };
    const coinsEarned = coinRewards[position] || 0;

    const user = await User.findById(req.user.id);
    if (coinsEarned > 0) {
      await user.addCoins(coinsEarned);
    }

    const race = await Race.create({
      userId: req.user.id,
      trackName: trackId,
      position,
      lapTimes: Array.isArray(lapTimes) ? lapTimes.slice(0, 3) : [],
      totalTime,
      coinsEarned,
      carUsed: carId || undefined,
      completedAt: new Date(),
    });

    res.status(200).json({ success: true, coinsEarned, newBalance: user.coinBalance, race });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { trackId } = req.params;
    const top = await Race.find({ trackName: trackId })
      .sort({ totalTime: 1 })
      .limit(10)
      .populate('userId', 'username')
      .populate('carUsed', 'name');
    res.status(200).json({ success: true, leaderboard: top });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRaceHistory = async (req, res) => {
  try {
    const races = await Race.find({ userId: req.user.id })
      .sort({ completedAt: -1 })
      .limit(50)
      .populate('carUsed', 'name');
    res.status(200).json({ success: true, races });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



