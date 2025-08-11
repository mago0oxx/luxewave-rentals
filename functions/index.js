/*const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();
const stripe = require("stripe")(functions.config().stripe.secret_key);
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.createStripeCheckout = functions
  .runWith({ memory: "256MB", timeoutSeconds: 60 })
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      // ✅ Manejo de preflight request
      if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "POST");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        return res.status(204).send("");
      }

      if (req.method !== "POST") {
        res.set("Access-Control-Allow-Origin", "*");
        return res.status(405).send("Method Not Allowed");
      }

      try {
        const { amount, email, name, date } = req.body;

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: email,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Reserva: ${name}`,
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
          ],
          success_url: "https://luxewave-rentals.vercel.app/success",
          cancel_url: "https://luxewave-rentals.vercel.app/cancel",
        });

        res.set("Access-Control-Allow-Origin", "*");
        return res.status(200).json({ url: session.url });
      } catch (error) {
        console.error("Stripe error:", error.message);
        res.set("Access-Control-Allow-Origin", "*");
        return res.status(500).json({ error: error.message });
      }
    });
  });*/
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret_key);

admin.initializeApp();

// Función invocable (onCall) que crea la sesión de checkout
exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  const { amount, email, name, date } = data;
  if (!amount || !email || !name) {
    throw new functions.https.HttpsError('invalid-argument', 'Faltan parámetros obligatorios.');
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Reserva: ${name}` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: 'https://luxewave-rentals.vercel.app/success',
      cancel_url: 'https://luxewave-rentals.vercel.app/cancel',
    });
    return { url: session.url };
  } catch (err) {
    console.error('Stripe error:', err.message);
    throw new functions.https.HttpsError('internal', 'Error al crear la sesión de pago.');
  }
});
