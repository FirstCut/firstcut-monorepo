
import Stripe from 'stripe';

class Billing {
  constructor() {
    this.stripe = Stripe(METEOR.settings.stripe.SECRET);
  }

  async chargeInvoice(invoice, token) {
    const { amount, currency, description } = invoice;
    const player = invoice.getCustomer();
    const charge = await this.stripe.charges.create({
      amount,
      currency,
      description,
      source: token,
    });
    console.log('the stripe charge');
    console.log(charge);
  }

  async createCustomer(player, stripeToken) {
    const customer = await this.stripe.customers.create({
      source: stripeToken,
      email: player.email,
    });
    const playerAsCustomer = player.set('customerId', customer.id);
    return playerAsCustomer.save();
  }
}

function handleError(err) {
  switch (err.type) {
    case 'StripeCardError':
      // A declined card error
      err.message; // => e.g. "Your card's expiration year is invalid."
      break;
    case 'RateLimitError':
      // Too many requests made to the API too quickly
      break;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      break;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      break;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      break;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      break;
    default:
      // Handle any other types of unexpected errors
      break;
  }
}

export default Billing;
