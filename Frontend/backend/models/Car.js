import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    speed: { type: Number, required: true, min: 0, max: 100 },
    acceleration: { type: Number, required: true, min: 0, max: 100 },
    handling: { type: Number, required: true, min: 0, max: 100 },
    color: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    isDefault: { type: Boolean, default: false },
    image: { type: String },
    model: { type: String },
  },
  { timestamps: true }
);

const Car = mongoose.model('Car', CarSchema);
export default Car;



