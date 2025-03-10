import paypal from "paypal-rest-sdk";
// import stripe from "stripe";

paypal.configure({
  mode: "sandbox", // Change to "live" for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

export { paypal,  };
