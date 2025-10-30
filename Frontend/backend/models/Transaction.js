import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['purchase', 'reward', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  coins: {
    type: Number,
    required: true,
    min: 0
  },
  stripeSessionId: {
    type: String,
    sparse: true // Allows null/undefined for non-Stripe transactions
  },
  stripePaymentId: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  packageName: {
    type: String,
    enum: ['Starter', 'Popular', 'Premium', 'Ultimate'],
    required: function() {
      return this.type === 'purchase';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get user transactions
transactionSchema.statics.getUserTransactions = function(userId, limit = 50) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
};

export default mongoose.model('Transaction', transactionSchema);

