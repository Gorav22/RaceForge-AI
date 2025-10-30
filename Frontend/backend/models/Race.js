import mongoose from 'mongoose';

const RaceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trackName: { type: String, required: true },
    position: { type: Number, required: true, min: 1, max: 5 },
    lapTimes: { type: [Number], default: [] },
    totalTime: { type: Number, required: true },
    coinsEarned: { type: Number, default: 0 },
    carUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Race = mongoose.model('Race', RaceSchema);
export default Race;



