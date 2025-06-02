// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Add key to .env

// export const createPaymentIntent = async (req, res) => {
//   const { amount } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // convert ₹ to paise
//       currency: "inr",
//       automatic_payment_methods: { enabled: true },
//     });

//     res.status(200).json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Stripe Error:", error);
//     res.status(500).json({ error: "Payment failed. Try again." });
//   }
// };
