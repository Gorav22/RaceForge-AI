import Stripe from 'stripe';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Coin packages configuration
const COIN_PACKAGES = {
  'starter': { coins: 100, price: 4.99, name: 'Starter' },
  'popular': { coins: 500, price: 19.99, name: 'Popular' },
  'premium': { coins: 1000, price: 34.99, name: 'Premium' },
  'ultimate': { coins: 2500, price: 79.99, name: 'Ultimate' }
};

/**
 * @desc    Create Stripe checkout session
 * @route   POST /api/payment/create-checkout-session
 * @access  Private
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.user.id;

    // Validate package
    if (!COIN_PACKAGES[packageId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package selected'
      });
    }

    const packageData = COIN_PACKAGES[packageId];

    // Create transaction record
    const transaction = await Transaction.create({
      userId,
      type: 'purchase',
      amount: packageData.price,
      coins: packageData.coins,
      packageName: packageData.name,
      status: 'pending'
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packageData.name} Package`,
              description: `${packageData.coins} Virtual Coins`,
            },
            unit_amount: Math.round(packageData.price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      client_reference_id: userId.toString(),
      metadata: {
        transactionId: transaction._id.toString(),
        packageId: packageId,
        userId: userId.toString()
      }
    });

    // Update transaction with session ID
    transaction.stripeSessionId = session.id;
    await transaction.save();

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message
    });
  }
};

/**
 * @desc    Handle Stripe webhook
 * @route   POST /api/payment/webhook
 * @access  Public (but secured with Stripe signature)
 */
export const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Find transaction by session ID
      const transaction = await Transaction.findOne({
        stripeSessionId: session.id
      });

      if (!transaction) {
        console.error('Transaction not found for session:', session.id);
        return res.status(404).json({ received: true });
      }

      // Prevent double processing
      if (transaction.status === 'completed') {
        return res.status(200).json({ received: true });
      }

      // Get user and add coins
      const user = await User.findById(transaction.userId);
      if (user) {
        await user.addCoins(transaction.coins);
        transaction.status = 'completed';
        transaction.stripePaymentId = session.payment_intent;
        await transaction.save();
        
        console.log(`✅ Coins added: User ${user.username} received ${transaction.coins} coins`);
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ received: true, error: error.message });
  }
};

/**
 * @desc    Get user transactions
 * @route   GET /api/payment/transactions
 * @access  Private
 */
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.getUserTransactions(userId, 50);

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: {
        transactions
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};

