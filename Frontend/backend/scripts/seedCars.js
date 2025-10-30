import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';

dotenv.config();

const cars = [
  { name: 'Starter', speed: 60, acceleration: 60, handling: 60, color: '#888888', price: 0, isDefault: true },
  { name: 'Speed Demon', speed: 75, acceleration: 65, handling: 60, color: '#FF0000', price: 100 },
  { name: 'Night Rider', speed: 70, acceleration: 70, handling: 70, color: '#000000', price: 150 },
  { name: 'Gold Rush', speed: 80, acceleration: 70, handling: 65, color: '#FFD700', price: 200 },
  { name: 'Chrome Bolt', speed: 75, acceleration: 80, handling: 70, color: '#C0C0C0', price: 250 },
  { name: 'Neon Flash', speed: 85, acceleration: 75, handling: 70, color: '#00FF00', price: 300 },
  { name: 'Shadow Racer', speed: 80, acceleration: 80, handling: 80, color: '#4B0082', price: 350 },
  { name: 'Thunder Strike', speed: 90, acceleration: 80, handling: 75, color: '#1E90FF', price: 400 },
  { name: 'Quantum', speed: 90, acceleration: 90, handling: 85, color: '#FF00FF', price: 500 },
  { name: 'Ultimate F1', speed: 100, acceleration: 100, handling: 100, color: '#FF4500', price: 1000 }
];

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/f1_template_db';
  await mongoose.connect(uri);
  await Car.deleteMany({});
  await Car.insertMany(cars);
  console.log('✅ Cars seeded!');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});



