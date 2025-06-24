/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require('cors')({ origin: true });


const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

admin.initializeApp();

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });


exports.createStripeCheckout = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {

    console.log("Body recibido en createStripeCheckout:", req.body);
    try {
      const { amount, email, name, date } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Reserva: ${name}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],

        success_url: 'https://luxewave-rentals.vercel.app/success',
        cancel_url: 'https://luxewave-rentals.vercel.app/cancel',
      });

      res.status(200).json({ url: session.url });
      res.set('Access-Control-Allow-Origin', '*'); // o el origen de tu frontend
      res.set('Access-Control-Allow-Methods', 'POST');

      console.log("Body recibido en createStripeCheckout:", req.body);
    } catch (error) {

      console.error('Error en createStripeCheckout:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

