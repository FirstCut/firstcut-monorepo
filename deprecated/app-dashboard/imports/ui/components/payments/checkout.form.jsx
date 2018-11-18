import React from 'react';
import PropTypes from 'prop-types';

import {
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  Elements,
  injectStripe,
} from 'react-stripe-elements';

const handleBlur = () => {
  console.log('[blur]');
};
const handleChange = (change) => {
  console.log('[change]', change);
};
const handleClick = () => {
  console.log('[click]');
};
const handleFocus = () => {
  console.log('[focus]');
};
const handleReady = () => {
  console.log('[ready]');
};

const createOptions = (fontSize, padding) => ({
  style: {
    base: {
      fontSize,
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'Source Code Pro, monospace',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding,
    },
    invalid: {
      color: '#9e2146',
    },
  },
});

class CheckoutForm extends React.Component {
  handleSubmit = (ev) => {
    ev.preventDefault();
    const { stripe } = this.props;
    if (stripe) {
      stripe.createToken()
        .then(payload => console.log('[token]', payload));
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Card
          <CardElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <button>
          Pay
        </button>
      </form>
    );
  }
}

function InjectedCheckoutForm(props) {
  const InjectedForm = injectStripe(CheckoutForm);
  return (
    <Elements>
      <InjectedForm {...props} />
    </Elements>
  );
}

export default InjectedCheckoutForm;
