import mongoose from 'mongoose';

const UserCarSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    isOwned: { type: Boolean, default: true },
    isSelected: { type: Boolean, default: false },
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserCarSchema.index({ userId: 1, carId: 1 }, { unique: true });

const UserCar = mongoose.model('UserCar', UserCarSchema);
export default UserCar;



